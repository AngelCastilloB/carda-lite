/**
 * @file wallet.service.ts
 *
 * @author Angel Castillo <angel.castillob@protonmail.com>
 * @date   Apr 20 2022
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* IMPORTS *******************************************************************/

import { Injectable }            from '@angular/core';
import { environment }           from 'src/environments/environment';
import * as CardanoSerialization from '@emurgo/cardano-serialization-lib-asmjs'
import { Wallet }                from "../models/wallet";
import { NetworkId }             from '../models/networkId';
import { entropyToMnemonic,
         mnemonicToEntropy,
         validateMnemonic }      from 'bip39';
import { NetworkParameters }     from '../models/networkParameters';
import CoinSelection             from '../vendors/coinSelection.js'

/* CONSTANTS **********************************************************************************************************/

const ENTROPY_SIZE:            number = 32;
const ADA_LOVELACE_DEATH_YEAR: number = 1852;
const ADA_LOVELACE_BIRTH_YEAR: number = 1815;
const ADA_LOVELACE:            string = 'lovelace';
const ACCOUNT_INDEX:           number = 0;
const INVALID_ENTROPY_MSG:     string = "Invalid Entropy";
const INVALID_MNEMONIC_MSG:    string = "Invalid Mnemonic";

/* EXPORTS ************************************************************************************************************/

@Injectable(
{
  providedIn: 'root'
})

/**
 * @summary Service for importing/exporing wallet seed phrases, signing and sending transactions to the blockchain.
 */
export class WalletService
{
  /**
   * Initiaize a new instance of the WalletService class.
   */
  constructor()
  {
  }

  /**
   * Create a new mnemonic seed phrase from an entropy source.
   * 
   * @param entropy Entropy source for the seed phrase generation. If this parameter is not provided
   * getRandomValues will be used as entropy source.
   * 
   * @returns The new seed phrase.
   * 
   * @remark This method only return 24 word lenght seed phrases.
   */
  public createSeedPhrases(entropy?: Uint8Array)
  {
    if (!entropy)
    {
      // 256 bits of entropy (24 words)
      entropy = new Uint8Array(ENTROPY_SIZE);
      window.crypto.getRandomValues(entropy);
    }
    else
    {
      if (entropy.length < 16)
        throw new Error(INVALID_ENTROPY_MSG);

      if (entropy.length > 32)
        throw new Error(INVALID_ENTROPY_MSG);

      if (entropy.length % 4 !== 0)
        throw new Error(INVALID_ENTROPY_MSG);
    }

    return entropyToMnemonic(<Buffer>entropy.buffer);
  }

  /**
   * Gets whther the given mnemonic is valid or not.
   * 
   * @param seedPhrase The mnemonic to validate.
   * 
   * @returns True if the mnemonic is valid; otherwise; false.
   */
  public isValidMnemonic(seedPhrase: string)
  {
    return validateMnemonic(seedPhrase);
  }

  /**
   * Creates a wallet instance from a given seed phrase.  
   * 
   * @param seedPhrase The seed prhase to create the wallet from.
   * 
   * @returns A new wallet instance.
   */
  public create(seedPhrase: string): Wallet
  {
    if (!this.isValidMnemonic(seedPhrase))
      throw new Error(INVALID_MNEMONIC_MSG);

    const entropy = mnemonicToEntropy(seedPhrase);
    const rootKey = CardanoSerialization.Bip32PrivateKey.from_bip39_entropy(Buffer.from(entropy, 'hex'), Buffer.from(''));

    const accountKey = CardanoSerialization.Bip32PrivateKey.from_bytes(rootKey.as_bytes())
        .derive(this.harden(ADA_LOVELACE_DEATH_YEAR)) // Purpose
        .derive(this.harden(ADA_LOVELACE_BIRTH_YEAR)) // Coin Type
        .derive(this.harden(ACCOUNT_INDEX));

    // We derive the first payment key and stake key.
    const paymentKey = accountKey.derive(0).derive(0).to_raw_key();
    const stakeKey   = accountKey.derive(2).derive(0).to_raw_key();

    const paymentKeyHash = paymentKey.to_public().hash();
    const stakeKeyHash   = stakeKey.to_public().hash();

    const networkId = environment.networkId === NetworkId.Mainnet ? 
        CardanoSerialization.NetworkInfo.mainnet().network_id() : 
        CardanoSerialization.NetworkInfo.testnet().network_id();
    
    const paymentAddr = CardanoSerialization.BaseAddress.new(
      networkId,
      CardanoSerialization.StakeCredential.from_keyhash(paymentKeyHash),
      CardanoSerialization.StakeCredential.from_keyhash(stakeKeyHash)
    ).to_address().to_bech32();

    // We are only supporting single address mode for this proof of concept, so we only 
    // need the first payment key and its payment address.
    return new Wallet(paymentKey, paymentAddr);
  }

  /**
   * Sign the given transaction with the payment key.
   * 
   * @param wallet The wallet that will sign the transaction. 
   * @param tx The transaction to be signed.
   * 
   * @returns The signed transaction.
   */
  public signTransaction(wallet: Wallet, tx: CardanoSerialization.Transaction)
  {  
    const txWitnessSet  = CardanoSerialization.TransactionWitnessSet.new();
    const vkeyWitnesses = CardanoSerialization.Vkeywitnesses.new();
    const txHash        = CardanoSerialization.hash_transaction(tx.body());

    const vkey = CardanoSerialization.make_vkey_witness(txHash, wallet.paymentKey);
    vkeyWitnesses.add(vkey);
 
    txWitnessSet.set_vkeys(vkeyWitnesses);

    return txWitnessSet;
  }

  /**
   * This hardening function prevents public key generation and helps preserve the security of the keys.
   * 
   * @param num The number to be hardened.
   * 
   * @returns The hardened number
   */
  private harden(num: number)
  {
    return 0x80000000 + num
  }

  /**
   * Builds a transaction to send ada.
   * 
   * @param wallet The address where the ADA is coming from.
   * @param tarAddress The address to send the ada to.
   * @param amount  The amount to send.
   * 
   * @returns The transaction.
   */
  async buildTransaction(wallet: Wallet, tarAddress: string, amount: number, params: NetworkParameters, sourceUtxos: any)
  {
    CoinSelection.setProtocolParameters(
      params.minUtxo,
      params.linearFee.minFeeA,
      params.linearFee.minFeeB,
      params.maxTxSize.toString()
    );

    let txBuilder: CardanoSerialization.TransactionBuilder = this.createTranscationBuilder(params);

    const walletAddress = CardanoSerialization.Address.from_bech32(wallet.paymentAddress);
    const targetAddress = CardanoSerialization.Address.from_bech32(tarAddress);

    const outputs = CardanoSerialization.TransactionOutputs.new();

    outputs.add(this.createOutput(targetAddress, CoinSelection.assetsFromJson([{
        unit: ADA_LOVELACE,
        quantity: amount.toString()}])
    , params));

    const transactionWitnessSet = CardanoSerialization.TransactionWitnessSet.new();
    let
    {
      input,
      change
    } = CoinSelection.randomImprove(sourceUtxos, outputs, 8, []);

    input.forEach((utxo) =>
    {
      txBuilder.add_input(
        utxo.output().address(),
        utxo.input(),
        utxo.output().amount()
      );
    });

    console.log("total outputs: " + outputs.len());
    for (let i = 0; i < outputs.len(); i++)
      txBuilder.add_output(outputs.get(i));
  
    const changeMultiAssets = change.multiasset();

    // check if change value is too big for single output
    if (changeMultiAssets && change.to_bytes().length * 2 > parseInt(params.maxValSize))
    {
      const partialChange = CardanoSerialization.Value.new(CardanoSerialization.BigNum.from_str("0"));

      const partialMultiAssets = CardanoSerialization.MultiAsset.new();
      const policies = changeMultiAssets.keys();

      const makeSplit = () =>
      {
        for (let j = 0; j < changeMultiAssets.len(); j++)
        {
          const policy = policies.get(j);
          const policyAssets = changeMultiAssets.get(policy);
          const assetNames = policyAssets.keys();
          const assets = CardanoSerialization.Assets.new();

          for (let k = 0; k < assetNames.len(); k++)
          {
            const policyAsset = assetNames.get(k);
            const quantity = policyAssets.get(policyAsset);

            assets.insert(policyAsset, quantity);

            const checkMultiAssets = CardanoSerialization.MultiAsset.from_bytes(partialMultiAssets.to_bytes());

            checkMultiAssets.insert(policy, assets);

            const checkValue = CardanoSerialization.Value.new(CardanoSerialization.BigNum.from_str("0"));

            checkValue.set_multiasset(checkMultiAssets);

            if (checkValue.to_bytes().length * 2 >= parseInt(params.maxValSize))
            {
              partialMultiAssets.insert(policy, assets);
              return;
            }
          }

          partialMultiAssets.insert(policy, assets);
        }
      };
      makeSplit();

      partialChange.set_multiasset(partialMultiAssets);

      const minAda = CardanoSerialization.min_ada_required(
        partialChange,
        false,
        CardanoSerialization.BigNum.from_str(params.minUtxo));

      partialChange.set_coin(minAda);

      txBuilder.add_output(
        CardanoSerialization.TransactionOutput.new(
          walletAddress,
          partialChange));
    }

    txBuilder.add_change_if_needed(walletAddress);

    const txBody = txBuilder.build();

    const tx = CardanoSerialization.Transaction.new(
      txBody,
      CardanoSerialization.TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes()),
      null);

    const rawTx = tx.to_bytes();
    const size = rawTx.length * 2;

    if (size > params.maxTxSize)
      throw new Error("MAX_SIZE_REACHED");

      
    let txVkeyWitnesses = this.signTransaction(wallet, tx);

    transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

    const signedTx = CardanoSerialization.Transaction.new(
      tx.body(),
      transactionWitnessSet,
      tx.auxiliary_data()
    );

    console.log("Full Tx Size", signedTx.to_bytes().length);

    return this.toHex(signedTx.to_bytes());
  }

  /**
   * Creates a new eUTXO.
   * 
   * @param address The target address.
   * @param value The value to be locked on the eUTXO.
   * @param datum The datum sitting at the eUTXO.
   * 
   * @return The new output.
   */
  createOutput(address: any, value: any, parameters: NetworkParameters)
  {
    const v = value;
    const minAda = CardanoSerialization.min_ada_required(
      v,
      false,
      CardanoSerialization.BigNum.from_str(parameters.minUtxo)
    );

    if (minAda.compare(v.coin()) == 1)
      v.set_coin(minAda);

    const output = CardanoSerialization.TransactionOutput.new(address, v);

    return output;
  }

  /**
   * Creates the transaction builder object.
   * 
   * @returns The transaction builder.
   */
  createTranscationBuilder(params: NetworkParameters)
  {
    return CardanoSerialization.TransactionBuilder.new(
       CardanoSerialization.TransactionBuilderConfigBuilder.new()
      .fee_algo(CardanoSerialization.LinearFee.new(CardanoSerialization.BigNum.from_str(params.linearFee.minFeeA), CardanoSerialization.BigNum.from_str(params.linearFee.minFeeB)))
      .coins_per_utxo_word(CardanoSerialization.BigNum.from_str(params.coinsPerUtxoWord))
      .pool_deposit(CardanoSerialization.BigNum.from_str(params.poolDeposit))
      .key_deposit(CardanoSerialization.BigNum.from_str(params.keyDeposit))
      .max_value_size(parseInt(params.maxValSize))
      .max_tx_size(params.maxTxSize)
      .build());
  }

  /**
   * Converts a byte array to a hex string.
   * 
   * @param bytes The bytes to be encoded into a hex string.
   * 
   * @returns The byte array.
   */
  private toHex(bytes: any)
  {
    return Buffer.from(bytes).toString("hex");
  }
}
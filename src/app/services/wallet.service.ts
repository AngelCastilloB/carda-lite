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

/* CONSTANTS **********************************************************************************************************/

const ENTROPY_SIZE:            number = 32;
const ADA_LOVELACE_DEATH_YEAR: number = 1852;
const ADA_LOVELACE_BIRTH_YEAR: number = 1815;
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
}
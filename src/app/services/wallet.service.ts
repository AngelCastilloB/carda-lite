/**
 * @file Wallet.service.ts
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
import * as CardanoSerialization from '@emurgo/cardano-serialization-lib-asmjs'
import { Wallet }                from "../models/wallet";
import { Transaction }           from '../models/transaction';
import { entropyToMnemonic,
         mnemonicToEntropy,
         validateMnemonic }      from 'bip39';

/* CONSTANTS **********************************************************************************************************/

const ENTROPY_SIZE:        number = 32;
const INVALID_ENTROPY_MSG: string = "Invalid Entropy";

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
    console.log("B");
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
      entropy =  new Uint8Array(ENTROPY_SIZE);
      window.crypto.getRandomValues(entropy);
    }
    else
    {
      if (entropy.length < 16)
        throw new TypeError(INVALID_ENTROPY_MSG);

      if (entropy.length > 32)
        throw new TypeError(INVALID_ENTROPY_MSG);

      if (entropy.length % 4 !== 0)
        throw new TypeError(INVALID_ENTROPY_MSG);
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
  public isValidMneonic(seedPhrase: string)
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
    const entropy = mnemonicToEntropy(seedPhrase);
    const rootKey = CardanoSerialization.Bip32PrivateKey.from_bip39_entropy(Buffer.from(entropy, 'hex'), Buffer.from(''));

    const accountKey = CardanoSerialization.Bip32PrivateKey.from_bytes(rootKey.as_bytes())
        .derive(0x80000000 + 1852)
        .derive(0x80000000 + 1815)
        .derive(0x80000000);

    const paymentKey = accountKey.derive(0).derive(0).to_raw_key();
    const stakeKey   = accountKey.derive(2).derive(0).to_raw_key();

    const paymentKeyHash = paymentKey.to_public().hash();
    const stakeKeyHash = stakeKey.to_public().hash();

    const paymentAddr = CardanoSerialization.BaseAddress.new(
      CardanoSerialization.NetworkInfo.testnet().network_id(),
      CardanoSerialization.StakeCredential.from_keyhash(paymentKeyHash),
      CardanoSerialization.StakeCredential.from_keyhash(stakeKeyHash)
    ).to_address().to_bech32();

    return new Wallet(rootKey, accountKey, paymentKey, stakeKey, paymentAddr, new Array<Transaction>());
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
}
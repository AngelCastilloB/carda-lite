/**
 * @file wallet.ts
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

import { Bip32PrivateKey, PrivateKey } from '@emurgo/cardano-serialization-lib-asmjs'
import { Transaction }                 from '../models/transaction'

/* EXPORTS *******************************************************************/

/**
 * @summary The Horrocard model.
 */
 export class Wallet
 {
     /**
      * Initiaize a new instance of the WalletService class.
      * 
      * @param paymentKey The payment key.
      * @param paymentAddress The payment address.
      */
     constructor(
         public paymentKey: PrivateKey,
         public paymentAddress: string)
     {
     }
 }

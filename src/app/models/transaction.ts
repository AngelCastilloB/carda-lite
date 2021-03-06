/**
 * @file transaction.ts
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

/* EXPORTS *******************************************************************/

/**
 * @summary The transactio model.
 */
 export class Transaction
 {
     /**
      * Initiaize a new instance of the Transaction class.
      * 
      * @param txHash The transaction hash.
      * @param txIndex The transaction index.
      * @param blockHeight The block height.
      * @param blockTime The block time. 
      * @param outputAmount Transaction output amount.
      * @param fee transaction fee.
      */
     constructor(
         public txHash: string,
         public txIndex: number,
         public blockHeight: number,
         public blockTime: number,
         public outputAmount: number,
         public fee: number)
     {
     }
 }

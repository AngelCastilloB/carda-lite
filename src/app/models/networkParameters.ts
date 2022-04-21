/**
 * @file networkParameters.ts
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
 * @summary The network parameters.
 */
 export class NetworkParameters
 {
   /**
    * Initiaize a new instance of the NetworkParameters class.
    */
    constructor(
      public linearFee: any,
      public minUtxo: string = "1000000",
      public poolDeposit: string,
      public keyDeposit: string,
      public coinsPerUtxoWord: string,
      public maxValSize: string,
      public priceMem: number,
      public priceStep: number,
      public maxTxSize: number,)
    {
    }  
 }

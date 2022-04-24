/**
 * @file transactions.component.ts
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

import { Component, Input } from '@angular/core';
import { Transaction }      from 'src/app/models/transaction';
import { environment }      from 'src/environments/environment';

/* CONSTANTS ******************************************************************/

const ADA_DECIMAL_POINTS: number = 6;
const LOVELACE_IN_ADA:    number = 1000000;

/* EXPORTS ********************************************************************/

/**
 * Transactions component.
 */
@Component({
  selector: 'transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent
{
    @Input()
    transactions: Array<Transaction> = new Array<Transaction>();

    /**
     * Initiaize a new instance of the TransactionsComponent class.
     */
    constructor()
    {
    }

    /**
     * Get the cardano scan io url.
     * 
     * @param txHash The transaction hash.
     * 
     * @returns The url.
     */
    getCardanoScan(txHash: string)
    {
      return environment.cardanoScanIo + "/" + txHash;
    }

    /**
     * Converts from epoch ticks to current local time.
     * 
     * @param ticks seconds from epoch.
     * 
     * @returns current local time.
     */
    getDate(ticks: number)
    {
      var date = new Date(ticks * 1000);
  
      var months = new Array("Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul", "Aug", "Sep",
      "Oct", "Nov", "Dec");
  
      var day = date.getDate();
      var month = date.getMonth();
      var year = date.getFullYear();
  
      return year + "/" + months[month] + "/" + day;
    }

    /**
     * Gets the current balance.
     * 
     * @returns The balance.
     */
    getFormattedAmount(amount: number)
    {
      return (amount / LOVELACE_IN_ADA).toFixed(ADA_DECIMAL_POINTS) + " ₳";
    }
}
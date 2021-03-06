/**
 * @file balance.component.ts
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

import { Component, EventEmitter, Input, Output } from '@angular/core';

/* CONSTANTS *****************************************************************/

const ADA_DECIMAL_POINTS: number = 6;
const LOVELACE_IN_ADA:    number = 1000000;

/* EXPORTS *******************************************************************/

/**
 * Balance component.
 */
@Component({
  selector: 'balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent
{
    @Input()
    currentBalance:number = 0; // In lovelaces

    @Output()
    onRefresh:EventEmitter<void> =new EventEmitter<void>();

    /**
     * Initiaize a new instance of the BalanceComponent class.
     */
    constructor()
    {
    }

    /**
     * Raises the refresh event to the parent.
     */
    refresh()
    {
      this.onRefresh.emit();
    }

    /**
     * Gets the current balance.
     * 
     * @returns The balance.
     */
    getBalance()
    {
      return (this.currentBalance / LOVELACE_IN_ADA).toFixed(ADA_DECIMAL_POINTS) + " ₳";
    }
}

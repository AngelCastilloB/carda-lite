/**
 * @file send.component.ts
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

import { Component, EventEmitter, Output } from '@angular/core';

/* CONSTANTS *****************************************************************/

const LOVELACE_IN_ADA: number = 1000000;

/* EXPORTS *******************************************************************/

/**
 * Send component.
 */
@Component({
  selector: 'send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css']
})
export class SendComponent
{
    _receivingAddress: string = "";
    _amount:           number = 0;

    @Output()
    onSend:EventEmitter<any> = new EventEmitter<any>();

    /**
     * Initiaize a new instance of the SendComponent class.
     */
    constructor()
    {
    }

    /**
     * Event handler for when the send button is clicked.
     */
    onSendClick()
    {
      this.onSend.emit({"receivingAddress": this._receivingAddress,"amount": Math.floor(this._amount * LOVELACE_IN_ADA)});
    }

    /**
     * Checks whether the keypress is valid.
     * 
     * @param key The key being pressed.
     * 
     * @returns true if valid; otherwise; false.
     */
    keyPressNumbersWithDecimal(key:any)
    {
      var keycode = (key.which) ? key.which : key.keyCode;

      if (!(keycode == 8 || keycode == 46) && (keycode < 48 || keycode > 57))
      {
          return false;
      }
      else
      {
          var parts = key.srcElement.value.split('.');

          if (parts.length > 1 && keycode == 46)
              return false;

          return true;
      }
    }
}

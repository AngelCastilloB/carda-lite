/**
 * @file app.component.ts
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

import { Component }         from '@angular/core';
import { WalletService }     from '../../services/wallet.service'
import { BlockfrostService } from '../../services/blockfrost.service';

/* EXPORTS ********************************************************************/

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}


/**
 * Main application component.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent
{
  tiles: Tile[] = [
    {text: 'One', cols: 8, rows: 4, color: 'lightblue'},
    {text: 'Four', cols: 4, rows: 4, color: '#DDBDF1'},
  ];

  title = 'carda-lite';

    /**
   * Initiaize a new instance of the WalletService class.
   */
     constructor(_walletService: WalletService, _blockfrostService: BlockfrostService)
     {/*
       let seed = _walletService.createSeedPhrases();
        console.log(seed);

        console.log(_walletService.create("ginger tobacco ignore sheriff jelly clean leisure century cheese light lend attitude quality blur cage outer census earn visual hour leader special budget logic"));
        _blockfrostService.getLatestProtocolParameters().subscribe((x)=> console.log(x));

        _blockfrostService.getAddressUtxos("addr_test1qp8x8l9ldlmhf5s285fa2g74k0wfjskqztvqw7vda2x54qzwa5e343pw7w8d2d3sqh4uv7303r29mugnlj6uewhrcyvqr20x50").subscribe((x)=> console.log(x));
        _blockfrostService.getAddressBalance("addr_test1qp8x8l9ldlmhf5s285fa2g74k0wfjskqztvqw7vda2x54qzwa5e343pw7w8d2d3sqh4uv7303r29mugnlj6uewhrcyvqr20x50").subscribe((x)=> console.log(x));
        _blockfrostService.getTransactions("addr_test1qp8x8l9ldlmhf5s285fa2g74k0wfjskqztvqw7vda2x54qzwa5e343pw7w8d2d3sqh4uv7303r29mugnlj6uewhrcyvqr20x50").subscribe((x)=> console.log(x));
      */
     }
   
}

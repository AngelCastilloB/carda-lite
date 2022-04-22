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

import { Component, Inject } from '@angular/core';
import { WalletService }     from '../../services/wallet.service'
import { BlockfrostService } from '../../services/blockfrost.service';
import { Transaction }       from 'src/app/models/transaction';
import { MatDialog,
         MatDialogRef,
         MAT_DIALOG_DATA}    from '@angular/material/dialog';
import { NetworkParameters } from 'src/app/models/networkParameters';

/* EXPORTS ********************************************************************/

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
    _isMnemonicValid: boolean = true;
    _wallet:          any     = null;
    _currentBalance:  number  = 0;
    _transactions:    Array<Transaction> = new Array<Transaction>();
    _utxos:           Array<any>         = new Array<any>();
    _params:          NetworkParameters  = null;

    /**
     * Initiaize a new instance of the AppComponent class.
     */
    constructor(private _walletService: WalletService, private _blockfrostService: BlockfrostService, public dialog: MatDialog)
    {
      this._blockfrostService.submitTransaction("84a30082825820bfb2eae65b137f043bd17c981240d68797071a0e210eb6b2ed340e97b29c8f3900825820729d96d69ade456da5e0c42fd81b9e4792a7dcf3abad64f06570ddc805f3905f000182825839004e63fcbf6ff774d20a3d13d523d5b3dc9942c012d807798dea8d4a804eed331ac42ef38ed5363005ebc67a2f88d45df113fcb5ccbae3c1181a05f5e100825839004e63fcbf6ff774d20a3d13d523d5b3dc9942c012d807798dea8d4a804eed331ac42ef38ed5363005ebc67a2f88d45df113fcb5ccbae3c1181a36d37f5b021a000296a5a1008182582045b6303466fb162d81fe2943db5ab2c6eb7d1dbfcb40cbb6d2d9c8d4c8e65bf65840b71a47d3113e77e2a6ace4771d353941b60e99ae8c5eccc11f437568386f27da257059d53a2c955d8b7aa7b70cc9753510d8fa82808c9abf3832fbe59cbf1b0df5f6").subscribe((x)=> console.log(x));
    }

    /**
     * Unlocks the wallets given its seed phrase.
     * 
     * @param seed The seed phrase.
     */
    unlock(seed: string)
    {
      if (this._walletService.isValidMnemonic(seed))
      {
        this._isMnemonicValid = true;
        this._wallet = this._walletService.create(seed);
        this.onWallteRefresh();
      }
      else
      {
        this._isMnemonicValid = false;
      }
    }

    /**
     * Event handler for the wallet refresh event.
     */
    onWallteRefresh()
    {
      this._currentBalance = 0;
      this._transactions = new Array<Transaction>();

      if (this._wallet !== null)
      {
        this._blockfrostService.getAddressBalance(this._wallet.paymentAddress).subscribe((x)=> this._currentBalance = x);
        this._blockfrostService.getTransactions(this._wallet.paymentAddress).subscribe((x)=> {
          this._transactions.push(x);
          this._transactions.sort((a, b)=> {
            return b.blockTime - a.blockTime;
          });
        });
        this._blockfrostService.getAddressUtxos(this._wallet.paymentAddress).subscribe((x)=> this._utxos = x);
        this._blockfrostService.getLatestProtocolParameters().subscribe((x)=> this._params = x);
      }
    }

    /**
     * Event handler for the sent event.
     */
    async onSend(details: any)
    {
      this.openDialog("Sending Transaction", "The transaction is being sent.");

      let address = details.receivingAddress;
      let amount  = details.Amount;

      let transaction = await this._walletService.buildTransaction(this._wallet, address, amount, this._params, this._utxos);
      console.log(transaction);
     }
    
    /**
     * Event handler for the on logout event.
     */
    onLogout()
    {
      this._wallet         = null;
      this._currentBalance = 0;
      this._utxos          = new Array<any>();
    }

    /**
     * Gets whether ther eis a wallet currently unlocked.
     */
    isWalletUnlocked()
    {
      return this._wallet !== null;
    }

    /**
     * Gets the payment address of this wallet.
     */
    getAddress()
    {
      return this._wallet.paymentAddress;
    }

    /**
     * Gets the list of transactions.
     * 
     * @returns The list of transactions.
     */
    getTransaction()
    {
      return this._transactions;
    }

  /**
   * Opens the dialogs showing the seed phrase.
   */
    openDialog(title: string, content: string): void
    {
      const dialogRef = this.dialog.open(MessageDialog,
      {
        width: '600px',
        data: {"title": title, "content":content }
      });
    }
}

/* DIALOG ********************************************************************/

@Component({
  selector: 'message-dialog',
  template: `<h1 mat-dialog-title>{{messages.title}}</h1>
              <div mat-dialog-content>
                <p>{{messages.content}}</p>
                <br>
              </div>
              <div mat-dialog-actions>
                <button mat-raised-button color="primary" (click)="onCloseClick()">Close</button>
              </div>`,
})
export class MessageDialog
{
  /**
   * Initializes a new instance of the SeedDialog.
   * 
   * @param dialogRef The dialog reference.
   * @param seeds The seed phrase.
   */
  constructor(
    public dialogRef: MatDialogRef<MessageDialog>,
    @Inject(MAT_DIALOG_DATA)public messages: any) {}

  /**
   * Closes the dialod.
   */
  onCloseClick(): void
  {
    this.dialogRef.close();
  }
}
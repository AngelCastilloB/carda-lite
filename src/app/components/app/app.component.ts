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

import { Component, EventEmitter, Inject }  from '@angular/core';
import { WalletService }                    from '../../services/wallet.service'
import { BlockfrostService }                from '../../services/blockfrost.service';
import { Transaction }                      from 'src/app/models/transaction';
import { MatDialog,
         MatDialogRef,
         MAT_DIALOG_DATA}                   from '@angular/material/dialog';
import { NetworkParameters }                from 'src/app/models/networkParameters';
import { ModalMessageType }                 from '../../models/modalMessageType'
import { interval, exhaustMap, takeUntil, 
         mergeMap, timer, from }            from 'rxjs';
import CoinSelection                        from '../../vendors/coinSelection.js'

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
    _isMnemonicValid:  boolean = true;
    _wallet:           any     = null;
    _currentBalance:   number  = 0;
    _transactions:     Array<Transaction>   = new Array<Transaction>();
    _utxos:            Array<any>           = new Array<any>();
    _params:           NetworkParameters    = null;
    _onMessageUpdate$: EventEmitter<{type: ModalMessageType, message: string}> = new EventEmitter<{type: ModalMessageType, message: string}>();

    /**
     * Initiaize a new instance of the AppComponent class.
     */
    constructor(private _walletService: WalletService, private _blockfrostService: BlockfrostService, public _dialogService: MatDialog)
    {
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

        this._blockfrostService.getAddressUtxos(this._wallet.paymentAddress)
          .pipe(mergeMap((result: any) => 
            from(Promise.all(result.map(async (utxo:any) => await CoinSelection.toUtxo(utxo, this._wallet.paymentAddress))))))
            .subscribe((x)=> this._utxos = x);

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
      let amount  = details.amount;

      try
      {
        this._onMessageUpdate$.emit({type: ModalMessageType.Information, message: "Building transaction..."});
        let transaction = await this._walletService.buildTransaction(this._wallet, address, amount, this._params, this._utxos);
  
        this._onMessageUpdate$.emit({type: ModalMessageType.Information, message: "Signing transaction..."});
        let signedTransaction = await this._walletService.signTransaction(this._wallet, transaction);
  
        this._onMessageUpdate$.emit({type: ModalMessageType.Information, message: "Submiting transaction..."});
        this._blockfrostService.submitTransaction(this.toHex(signedTransaction.to_bytes())).subscribe((hash)=>
        {
          this._onMessageUpdate$.emit({type: ModalMessageType.Waiting, message: "Waiting for transaction to confirm..."});

          // Wait for one minute (poll every 10 secs).
          const timer$ = timer(60000);
          const poll$ = interval(10000).pipe(
            exhaustMap(() => this._blockfrostService.getTransaction(hash)),
            takeUntil(timer$),
          ).subscribe((hash)=> {
            if (hash.length > 0)
            {
              poll$.unsubscribe();
              this._onMessageUpdate$.emit({type: ModalMessageType.Success, message: `Transaction confirmed!`});
              this.onWallteRefresh();
            }
          });
        });
      }
      catch (error)
      {
        this._onMessageUpdate$.emit({type: ModalMessageType.Error, message: error});
      }
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
      const dialogRef = this._dialogService.open(MessageDialog,
      {
        width: '600px',
        data: {"title": title, "content":{type: ModalMessageType.Waiting, message: ""}, "updateObs": this._onMessageUpdate$ }
      });
    }

    /**
     * Converts a byte array to a hex string.
     * 
     * @param bytes The bytes to be encoded into a hex string.
     * 
     * @returns The byte array.
     */
    private toHex(bytes: any)
    {
      return Buffer.from(bytes).toString("hex");
    }
}

/* DIALOG ********************************************************************/

@Component({
  selector: 'message-dialog',
  template: `<h1 mat-dialog-title>{{messages.title}}</h1>
              <div mat-dialog-content>
                <error-animation *ngIf="_message.type === ModalMessageType.Error"></error-animation>
                <information-animation *ngIf="_message.type === ModalMessageType.Information"></information-animation>
                <success-animation *ngIf="_message.type === ModalMessageType.Success"></success-animation>
                <waiting-animation *ngIf="_message.type === ModalMessageType.Waiting"></waiting-animation>
                <warning-animation *ngIf="_message.type === ModalMessageType.Warning"></warning-animation>
                <p>{{_message.message}}</p>
                <br>
              </div>
              <div mat-dialog-actions>
                <button mat-raised-button color="primary" (click)="onCloseClick()">Close</button>
              </div>`,
})
export class MessageDialog
{
  // Hack to enable enum use in template.
  ModalMessageType: any = ModalMessageType;
  _message: {type: ModalMessageType, message: string} = null;
  _connection = null;

  /**
   * Initializes a new instance of the SeedDialog.
   * 
   * @param dialogRef The dialog reference.
   * @param seeds The seed phrase.
   */
  constructor(
    public dialogRef: MatDialogRef<MessageDialog>,
    @Inject(MAT_DIALOG_DATA)public messages: any)
    {
      this._message = messages;
      this._connection = messages.updateObs.subscribe((newMessage) => this._message = newMessage);
    }

  /**
   * Closes the dialod.
   */
  onCloseClick(): void
  {
    console.log(this._connection);
    this._connection.unsubscribe();
    this.dialogRef.close();
  }
}
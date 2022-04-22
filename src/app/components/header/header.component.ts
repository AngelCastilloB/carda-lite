/**
 * @file header.component.ts
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
 
import { WalletService }                           from 'src/app/services/wallet.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Component, Inject, Input,
         Output, EventEmitter }                    from '@angular/core';

/* EXPORTS ********************************************************************/

/**
 * Header component.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent
{
  @Input()
  isWalletUnlocked:boolean = true;

  @Output()
  onLogout:EventEmitter<void> =new EventEmitter<void>();
  
  /**
   * Initiaize a new instance of the HeaderComponent class.
   */
  constructor(private _service: WalletService, public dialog: MatDialog)
  {
  }

  /**
   * Opens the diaglos showing the seed phrase.
   */
  openDialog(): void
  {
    const dialogRef = this.dialog.open(SeedDialog,
    {
      width: '600px',
      data: this._service.createSeedPhrases()
    });
  }

  /**
   * Opens the diaglos showing the seed phrase.
   */
   logout(): void
   {
     this.onLogout.emit();
   }
}

/* DIALOG ********************************************************************/

@Component({
  selector: 'seed-dialog',
  template: `<h1 mat-dialog-title>Create a New Wallet</h1>
             <div mat-dialog-content>
               <p>The new wallet is created together with a mnemonic phrase. Write the mnemonic phrase down, you will need it to access your wallet. <b>Don’t copy it to your clipboard or save it anywhere online.</b></p>
               <br>
               <div style="border: 2px solid red;border-radius: 5px;padding: 10px;">{{seeds}}</div>
               <br>
             </div>
             <div mat-dialog-actions>
               <button mat-raised-button class="button-right" color="primary" (click)="onCloseClick()">Close</button>
             </div>`,
})
export class SeedDialog
{
  /**
   * Initializes a new instance of the SeedDialog.
   * 
   * @param dialogRef The dialog reference.
   * @param seeds The seed phrase.
   */
  constructor(
    public dialogRef: MatDialogRef<SeedDialog>,
    @Inject(MAT_DIALOG_DATA)public seeds: string) {}

  /**
   * Closes the dialod.
   */
  onCloseClick(): void
  {
    this.dialogRef.close();
  }
}

/**
 * @file app.module.ts
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

import { NgModule }                      from '@angular/core';
import { BrowserModule }                 from '@angular/platform-browser';
import { HttpClientModule }              from '@angular/common/http';
import { AppRoutingModule }              from './app-routing.module';
import { AppComponent, MessageDialog }   from './components/app/app.component';
import { HeaderComponent, SeedDialog }   from './components/header/header.component';
import { BalanceComponent }              from './components/balance/balance.component';
import { ReceiveComponent }              from './components/receive/receive.component';
import { TransactionsComponent }         from './components/transactions/transactions.component';
import { SendComponent }                 from './components/send/send.component';
import { ErrorAnimationComponent }       from './components/animations/error-animation/error-animation.component';
import { InformationAnimationComponent } from './components/animations/information-animation/information-animation.component';
import { SuccessAnimationComponent }     from './components/animations/success-animation/success-animation.component';
import { WaitingAnimationComponent }     from './components/animations/waiting-animation/waiting-animation.component';
import { WarningAnimationComponent }     from './components/animations/warning-animation/warning-animation.component';
import { BrowserAnimationsModule }       from '@angular/platform-browser/animations';
import { WalletService }                 from './services/wallet.service'
import { BlockfrostService }             from './services/blockfrost.service'
import { MatToolbarModule }              from '@angular/material/toolbar'
import { MatButtonModule }               from '@angular/material/button'
import { MatIconModule }                 from '@angular/material/icon'
import { MatGridListModule }             from '@angular/material/grid-list'
import { MatCardModule }                 from '@angular/material/card'
import { MatFormFieldModule }            from '@angular/material/form-field'
import { MatInputModule }                from '@angular/material/input'
import { MatDialogModule }               from '@angular/material/dialog'
import { FlexLayoutModule }              from '@angular/flex-layout'
import { QRCodeModule }                  from 'angular2-qrcode';
import { AutosizeModule}                 from '@techiediaries/ngx-textarea-autosize';
import { FormsModule }                   from '@angular/forms';

/* EXPORTS ********************************************************************/

/**
 * App module declaration.
 */
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SeedDialog,
    BalanceComponent,
    ReceiveComponent,
    TransactionsComponent,
    SendComponent,
    MessageDialog,
    // Animations
    ErrorAnimationComponent,
    InformationAnimationComponent,
    SuccessAnimationComponent,
    WaitingAnimationComponent,
    WarningAnimationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    FlexLayoutModule,
    QRCodeModule,
    AutosizeModule,
    FormsModule
  ],
  providers: [WalletService, BlockfrostService],
  bootstrap: [AppComponent]
})
export class AppModule { }

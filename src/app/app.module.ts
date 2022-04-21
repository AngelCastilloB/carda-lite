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

import { NgModule }                    from '@angular/core';
import { BrowserModule }               from '@angular/platform-browser';
import { HttpClientModule }            from '@angular/common/http';
import { AppRoutingModule }            from './app-routing.module';
import { AppComponent }                from './components/app/app.component';
import { HeaderComponent, SeedDialog } from './components/header/header.component';
import { BrowserAnimationsModule }     from '@angular/platform-browser/animations';
import { WalletService }               from './services/wallet.service'
import { BlockfrostService }           from './services/blockfrost.service'
import { MatToolbarModule }            from '@angular/material/toolbar'
import { MatButtonModule }             from '@angular/material/button'
import { MatIconModule }               from '@angular/material/icon'
import { MatGridListModule }           from '@angular/material/grid-list'
import { MatCardModule }               from '@angular/material/card'
import { MatFormFieldModule }          from '@angular/material/form-field'
import { MatInputModule }              from '@angular/material/input'
import { MatDialogModule }             from '@angular/material/dialog'

/* EXPORTS ********************************************************************/

/**
 * App module declaration.
 */
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SeedDialog
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
    MatDialogModule
  ],
  providers: [WalletService, BlockfrostService],
  bootstrap: [AppComponent]
})
export class AppModule { }

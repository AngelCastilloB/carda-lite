/**
 * @file blockfrost.service.ts
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
 
import { Injectable }                                 from '@angular/core';
import { environment }                                from 'src/environments/environment';
import { Observable, throwError, catchError }         from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

/* EXPORTS ********************************************************************/

@Injectable(
{
  providedIn: 'root'
})
/**
 * @summary Service for interacting with the cardano blockchain through blockfrost api.
 */
export class BlockfrostService
{

  /**
   * Initiaize a new instance of the BlockfrostService class.
   */
  constructor(private _httpClient: HttpClient)
  {
  }

  /**
   * Gets the latest protocol parameters.
   * 
   * @returns Protocol parameters as of last epoch.
   */
  public getLatestProtocolParameters()
  {
    return this.sendRequest("/epochs/latest/parameters")
               .pipe(catchError(this.handleError));
  }

  /**
   * Gets the current balance of the address.
   * 
   * @param address The address to get the balance from.
   * 
   * @returns The balance.
   */
  public getAddressBalance(address: string)
  {
    return this.sendRequest(`/epochs/latest/addresses/${address}`)
               .pipe(catchError(this.handleError));
  }

  /**
   * Gets the list of all UTXOS of the given address.
   * 
   * @param address The address tog et the UTXOS from.
   * 
   * @returns The list of UTXOS.
   */
  public getAddressUtxos(address: string)
  {
    return this.sendRequest(`/addresses/${address}/utxos`)
               .pipe(catchError(this.handleError));
  }

  /**
   * Gets the list transactions related to this address.
   * 
   * @param address The address to get the transactions from.
   * 
   * @return The transaction list.
   */
  public getTransactions(address: string)
  {
    return this.sendRequest(`addresses/${address}/transactions`)
               .pipe(catchError(this.handleError));
  }

  /**
   * Sends a http GET request to blockfrost.
   * 
   * @param endpoint The endpoint to send the request to.
   * 
   * @returns The result of the request.
   */
  private sendRequest(endpoint: string) : Observable<Object>
  {
    return this._httpClient.get(`${environment.blockfrostEndpoint}\\${endpoint}`, {
      headers: new HttpHeaders({
        'project_id':  environment.blockfrost.projectId,
      })
    });
  }

  /**
   * Handles http errors if any.
   * 
   * @param error The error response to be handeled. 
   * 
   * @returns An observable that handles http errors.
   */
  private handleError(error: HttpErrorResponse): Observable<never>
  {
    console.log(error);

    if (error.error instanceof ErrorEvent)
    {
      console.error('An error occurred:', error.error.message);
    }
    else
    {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error.msg}`);
    }

    return throwError(`${error.error.msg}`);
  }
}
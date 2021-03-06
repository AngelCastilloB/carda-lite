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
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NetworkParameters }                          from '../models/networkParameters';
import { Observable, throwError, catchError, map,
         pluck, mergeAll, mergeMap, from, of }        from 'rxjs';
import { Transaction }                                from '../models/transaction';

/* CONSTANTS ******************************************************************/

const MINT_UTXO_VALUE: string = "1000000";
const ADA_TOKEN_NAME:  string = "lovelace";

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
    return this.sendRequest("epochs/latest/parameters")
               .pipe(catchError(this.handleError))
               .pipe(map((params: any)=> new NetworkParameters(
                  { minFeeA: params.min_fee_a.toString(), minFeeB: params.min_fee_b.toString()},
                  MINT_UTXO_VALUE,
                  params.pool_deposit, 
                  params.key_deposit,
                  params.coins_per_utxo_word,
                  params.max_val_size,
                  params.price_mem,
                  params.price_step,
                  parseInt(params.max_tx_size))
                ));
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
    return this.sendRequest(`addresses/${address}`)
               .pipe(catchError(this.handleError))
               .pipe(map((result: any) => result.amount.find((entry:any)=> entry.unit === ADA_TOKEN_NAME).quantity));
  }

  /**
   * Return content of the requested transaction.
   * 
   * @param hash Hash of the requested transaction.
   * 
   * @returns The transaction.
   */
  public getTransaction(hash: string)
  {
    return this.sendRequest(`txs/${hash}`)
              .pipe(catchError(val => of({hash:""})))
              .pipe(pluck('hash'));
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
    return this.sendRequest(`addresses/${address}/utxos`)
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
               .pipe(catchError(this.handleError))
               .pipe(mergeAll())
               .pipe(pluck('tx_hash'))
               .pipe(mergeMap(txId =>this.sendRequest(`txs/${txId}`)))
               .pipe(map((result: any) =>
               {
                let amount = result.output_amount.find((entry:any)=> entry.unit === ADA_TOKEN_NAME).quantity;
                return new Transaction(result.hash, result.index, result.block_height, result.block_time, amount, result.fees);
               }))
               .pipe(mergeMap((tx:Transaction) => this.sendRequest(`txs/${tx.txHash}/utxos`).pipe(map(result =>
                {
                  let totalInputAmount  = 0;
                  let totalOutputAmount = 0;

                  let inputs = result.inputs.filter((entry:any)=> entry.address === address);
                  
                  // If we found input coming from our wallet, we need to substract it.
                  inputs.forEach(element => {
                    totalInputAmount += parseInt(element.amount.find((entry:any)=> entry.unit === ADA_TOKEN_NAME).quantity);
                  });

                  let outputs =  result.outputs.filter((entry:any)=> entry.address === address);

                  // If we found output coming to our wallet, we need to add it.
                  outputs.forEach(element => {
                    totalOutputAmount += parseInt(element.amount.find((entry:any)=> entry.unit === ADA_TOKEN_NAME).quantity);
                  });

                  tx.outputAmount = totalOutputAmount - totalInputAmount;
                  return tx;
                }))));
  }

  /**
   * Submit a transaction to blockfrost.
   * 
   * @returns The result of the request.
   */
  public submitTransaction(cbor: any) : Observable<any>
  {
    const headersList = new HttpHeaders({
      'Content-Type': 'application/cbor',
      'project_id':  environment.blockfrost.projectId
    });

    // As per blockfrost documentation, we must sent the cbor in binary format in a raw body.
    const body = new Uint8Array(this.fromHex(cbor)).buffer;
   
    return this._httpClient.post(`${environment.blockfrostEndpoint}\/tx/submit`, body , { headers: headersList });
  }
     
  /**
   * Sends a http GET request to blockfrost.
   * 
   * @param endpoint The endpoint to send the request to.
   * 
   * @returns The result of the request.
   */
  private sendRequest(endpoint: string) : Observable<any>
  {
    return this._httpClient.get(`${environment.blockfrostEndpoint}\/${endpoint}`, {
      headers: new HttpHeaders({
        'project_id':  environment.blockfrost.projectId,
        'order': 'desc'
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
    if (error.error instanceof ErrorEvent)
    {
      console.error('An error occurred:', error.error.message);
      return throwError(`${error.error.message}`);
    }
    else
    {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error.msg}`);
    }

    return throwError(`${error.error.msg}`);
  }

  /**
   * Converts a hexadecimal string into a byte buffer.
   * 
   * @param hex the string to be converted.
   * 
   * @returns The byte array.
   */
  private fromHex(hex: any)
  {
    return Buffer.from(hex, "hex");
  }
}
/**
 * @file Wallet.service.spec.ts
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

import { TestBed, inject, tick, fakeAsync } from '@angular/core/testing';
import { BlockfrostService }                from '../services/blockfrost.service';
import { HttpClientTestingModule,
         HttpTestingController }            from '@angular/common/http/testing';
import { environment }                      from 'src/environments/environment';
import { NetworkParameters }                from '../models/networkParameters';
import { Transaction }                      from '../models/transaction';

/* TESTS *********************************************************************/

/**
 * Unit tests for the BlockfrostService class.
 */
describe('BlockfrostService', () =>
{
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BlockfrostService]
    });
  });

  it('#getAddressBalance should call upon the correct endpoint',
    fakeAsync(inject( [BlockfrostService, HttpTestingController],
      (service: BlockfrostService, backend: HttpTestingController) => {

          // Arrange
          const address       = 'addr_test1qp8x8l9ldlmhf5s285fa2g74k0wfjskqztvqw7vd…5e343pw7w8d2d3sqh4uv7303r29mugnlj6uewhrcyvqr20x50';
          const expectedUrl   = environment.blockfrostEndpoint + "/addresses/" + address;
          const dummyResponse = {amount: [{unit: "lovelace", quantity: 0}]};

          service.getAddressBalance(address).subscribe();

          const requestWrapper = backend.expectOne({url: expectedUrl});

          // Act
          requestWrapper.flush(dummyResponse);

          tick();

          // Assert
          expect(requestWrapper.request.method).toEqual('GET');
        }
      )
    ))

    it('#getAddressBalance should parse the correct amount from response',
    fakeAsync(inject( [BlockfrostService, HttpTestingController],
      (service: BlockfrostService, backend: HttpTestingController) => {

          // Arrange
          const address         = 'addr_test1qp8x8l9ldlmhf5s285fa2g74k0wfjskqztvqw7vd…5e343pw7w8d2d3sqh4uv7303r29mugnlj6uewhrcyvqr20x50';
          const expectedUrl     = environment.blockfrostEndpoint + "/addresses/" + address;
          const expectedBalance = 1000000;
          const dummyResponse   = {amount: [{unit: "lovelace", quantity: expectedBalance}]};

          let response: any = {};

          service.getAddressBalance(address).subscribe(
            (receivedResponse: any) => {
              response = receivedResponse;
            },
            (error: any) => {}
          );

          const requestWrapper = backend.expectOne({url: expectedUrl});

          // Act
          requestWrapper.flush(dummyResponse);

          tick();

          // Assert
          expect(response).toEqual(expectedBalance);
        }
      )
    ))

    it('#getLatestProtocolParameters should call upon the correct endpoint',
    fakeAsync(inject( [BlockfrostService, HttpTestingController],
      (service: BlockfrostService, backend: HttpTestingController) => {

          // Arrange
          const expectedUrl = environment.blockfrostEndpoint + "/epochs/latest/parameters";
          const dummyResponse      = { min_fee_a: 44, min_fee_b: 155381, min_utxo: "1000000", coins_per_utxo_word: "34482", key_deposit: "2000000", max_tx_size: 16384, max_val_size: "5000",
                                     pool_deposit: "500000000", price_mem: 0.0577, price_step: 0.0000721 };

          service.getLatestProtocolParameters().subscribe();

          const requestWrapper = backend.expectOne({url: expectedUrl});

          // Act
          requestWrapper.flush(dummyResponse);

          tick();

          // Assert
          expect(requestWrapper.request.method).toEqual('GET');
        }
      )
    ))

    it('#getLatestProtocolParameters should parse the correct parameters from response',
    fakeAsync(inject( [BlockfrostService, HttpTestingController],
      (service: BlockfrostService, backend: HttpTestingController) => {

          // Arrange
          const expectedUrl        = environment.blockfrostEndpoint + "/epochs/latest/parameters";
          const expectedParameters = new NetworkParameters({ minFeeA: "44", minFeeB: "155381"}, "1000000", "500000000", "2000000", "34482", "5000",  0.0577, 0.0000721, 16384); 
          const dummyResponse      = { min_fee_a: 44, min_fee_b: 155381, min_utxo: "1000000", coins_per_utxo_word: "34482", key_deposit: "2000000", max_tx_size: 16384, max_val_size: "5000",
                                       pool_deposit: "500000000", price_mem: 0.0577, price_step: 0.0000721 };
  
          let response: any = {};

          service.getLatestProtocolParameters().subscribe(
            (receivedResponse: any) => {
              response = receivedResponse;
            },
            (error: any) => {}
          );

          const requestWrapper = backend.expectOne({url: expectedUrl});

          // Act
          requestWrapper.flush(dummyResponse);

          tick();

          // Assert
          expect(response).toEqual(expectedParameters);
        }
      )
    ))

    it('#getAddressUtxos should call upon the correct endpoint',
    fakeAsync(inject( [BlockfrostService, HttpTestingController],
      (service: BlockfrostService, backend: HttpTestingController) => {

          // Arrange
          const address         = 'addr_test1qp8x8l9ldlmhf5s285fa2g74k0wfjskqztvqw7vd…5e343pw7w8d2d3sqh4uv7303r29mugnlj6uewhrcyvqr20x50';
          const expectedUrl     = environment.blockfrostEndpoint + "/addresses/" + address + "/utxos";
          const dummyResponse   = {};

          service.getAddressUtxos(address).subscribe();

          const requestWrapper = backend.expectOne({url: expectedUrl});

          // Act
          requestWrapper.flush(dummyResponse);

          tick();

          // Assert
          expect(requestWrapper.request.method).toEqual('GET');
        }
      )
    ))

    it('#getTransactions should call upon the correct endpoints',
    fakeAsync(inject( [BlockfrostService, HttpTestingController],
      (service: BlockfrostService, backend: HttpTestingController) => {

          // Arrange
          const address                = 'addr_test1qp8x8l9ldlmhf5s285fa2g74k0wfjskqztvqw7vd…5e343pw7w8d2d3sqh4uv7303r29mugnlj6uewhrcyvqr20x50';
          const txId                   = "000000000000000000000000000000000000";
          const expectedUrl            = environment.blockfrostEndpoint + `/addresses/${address}/transactions`;
          const expectedUrlDetails     = environment.blockfrostEndpoint + `/txs/${txId}`;
          const dummyResponse          = [{ tx_hash: txId }];
          const txDetailsDummyResponse = { output_amount: [{unit: "lovelace", quantity: 0}], hash: txId, index: 0,  block_height: 0, block_time: 0, amount: 0, fees: 0.0 };

          let responseTxs: any = {};

          service.getTransactions(address).subscribe(
            (receivedResponse: any) => {
              responseTxs = receivedResponse;
            },
            (error: any) => {}
          );

          // Act
          const requestWrapperTxs = backend.expectOne({url: expectedUrl});
          requestWrapperTxs.flush(dummyResponse);

          tick();

          const requestWrapperDetails = backend.expectOne({url: expectedUrlDetails});
          requestWrapperDetails.flush(txDetailsDummyResponse);

          tick();

          // Assert
          expect(requestWrapperTxs.request.method).toEqual('GET');
          expect(requestWrapperDetails.request.method).toEqual('GET');
        }
      )
    ))

    it('#getTransactions should retrieve the correct transaction details',
    fakeAsync(inject( [BlockfrostService, HttpTestingController],
      (service: BlockfrostService, backend: HttpTestingController) => {

          // Arrange
          const address                = 'addr_test1qp8x8l9ldlmhf5s285fa2g74k0wfjskqztvqw7vd…5e343pw7w8d2d3sqh4uv7303r29mugnlj6uewhrcyvqr20x50';
          const txId                   = "000000000000000000000000000000000000";
          const expectedUrl            = environment.blockfrostEndpoint + `/addresses/${address}/transactions`;
          const expectedUrlDetails     = environment.blockfrostEndpoint + `/txs/${txId}`;
          const transaction            = new Transaction(txId, 0, 0, 0, 0, 0.0);
          const dummyResponse          = [{ tx_hash: txId }];
          const txDetailsDummyResponse = { output_amount: [{unit: "lovelace", quantity: 0}], hash: txId, index: 0,  block_height: 0, block_time: 0, amount: 0, fees: 0.0 };

          let responseTxs: any = {};

          service.getTransactions(address).subscribe(
            (receivedResponse: any) => {
              responseTxs = receivedResponse;
            },
            (error: any) => {}
          );

          // Act
          const requestWrapperTxs = backend.expectOne({url: expectedUrl});
          requestWrapperTxs.flush(dummyResponse);

          tick();

          const requestWrapperDetails = backend.expectOne({url: expectedUrlDetails});
          requestWrapperDetails.flush(txDetailsDummyResponse);

          tick();

          // Assert
          expect(responseTxs).toEqual(transaction);
        }
      )
    ))
});

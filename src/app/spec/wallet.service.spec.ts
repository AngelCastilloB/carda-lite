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

import { TestBed }       from '@angular/core/testing';
import { WalletService } from '../services/wallet.service';

/* TESTS *********************************************************************/

describe('WalletService', () =>
{
  let service: WalletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletService);
  });

  it('#createSeedPhrases should return a 24 seed passphrase', () =>
  {
    const actual   = service.createSeedPhrases().split(' ').length;
    const expected = 24;

    // Assert
    expect(actual).toEqual(expected);
  });

  it('#createSeedPhrases should throw if called with an entropy source of less than 16 bytes', () =>
  {
    const invalidEntropySize = new Uint8Array(15);

    // Assert
    expect(()=> service.createSeedPhrases(invalidEntropySize)).toThrow();
  });

  it('#createSeedPhrases should throw if called with an entropy source of more than 32 bytes', () =>
  {
    const invalidEntropySize = new Uint8Array(33);

    // Assert
    expect(()=> service.createSeedPhrases(invalidEntropySize)).toThrow();
  });

  it('#createSeedPhrases should throw if called with an entropy source which size is not multiple of 4', () =>
  {
    const invalidEntropySize = new Uint8Array(17);

    // Assert
    expect(()=> service.createSeedPhrases(invalidEntropySize)).toThrow();
  });
});

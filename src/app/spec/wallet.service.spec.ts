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

/**
 * Unit tests for the WalletService class.
 */
describe('WalletService', () =>
{
  let _service: WalletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    _service = TestBed.inject(WalletService);
  });

  it('#createSeedPhrases should return a 24 seed passphrase', () =>
  {
    // Arrange
    const expected = 24;

    // Act
    const actual = _service.createSeedPhrases().split(' ').length;

    // Assert
    expect(actual).toEqual(expected);
  });

  it('#createSeedPhrases should throw if called with an empty entropy source', () =>
  {
    // Arrange
    const invalidEntropySize = new Uint8Array(0);

    // Assert
    expect(()=> _service.createSeedPhrases(invalidEntropySize)).toThrow();
  });

  it('#createSeedPhrases should throw if called with an entropy source of less than 16 bytes', () =>
  {
    // Arrange
    const invalidEntropySize = new Uint8Array(15);

    // Assert
    expect(()=> _service.createSeedPhrases(invalidEntropySize)).toThrow();
  });

  it('#createSeedPhrases should throw if called with an entropy source of more than 32 bytes', () =>
  {
    // Arrange
    const invalidEntropySize = new Uint8Array(33);

    // Assert
    expect(()=> _service.createSeedPhrases(invalidEntropySize)).toThrow();
  });

  it('#createSeedPhrases should throw if called with an entropy source which size is not multiple of 4', () =>
  {
    // Arrange
    const invalidEntropySize = new Uint8Array(17);

    // Assert
    expect(()=> _service.createSeedPhrases(invalidEntropySize)).toThrow();
  });

  it('#isValidMnemonic should return false if mnemonic is too short', () =>
  {
    // Arrange
    const mnemonic = "basic web";

    // Act
    const actual = _service.isValidMnemonic(mnemonic);

    // Assert
    expect(actual).toBeFalse();
  });

  it('#isValidMnemonic should return false if mnemonic is too long', () =>
  {
    // Arrange
    const mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon";

    // Act
    const actual = _service.isValidMnemonic(mnemonic);

    // Assert
    expect(actual).toBeFalse();
  });

  it('#isValidMnemonic should return false if mnemonic contains invalid words', () =>
  {
    // Arrange
    const mnemonic = "basico website rider boardig kingdom jacket interest remind sugar solution brick universe drive dignity live assume casual total nurse rotate gospel weasel remember good";

    // Act
    const actual = _service.isValidMnemonic(mnemonic);

    // Assert
    expect(actual).toBeFalse();
  });

  it('#isValidMnemonic should return false if mnemonic checksum is invalid', () =>
  {
    // Arrange
    const mnemonic = "basic web ride board kingdom basic web ride board kingdom basic web ride board kingdom";

    // Act
    const actual = _service.isValidMnemonic(mnemonic);

    // Assert
    expect(actual).toBeFalse();
  });

  it('#isValidMnemonic should return true if mnemonic is valid', () =>
  {
    // Arrange
    const mnemonic = "basic web ride board kingdom jacket interest remind sugar solution brick universe drive dignity live assume casual total nurse rotate gospel weasel remember good";

    // Act
    const actual = _service.isValidMnemonic(mnemonic);

    // Assert
    expect(actual).toBeTrue();
  });

  it('#create should throw if called with an invalid mnemonic', () =>
  {
    // Arrange
    const mnemonic = "basic web ride";

    // Assert
    expect(()=> _service.create(mnemonic)).toThrow();
  });

  it('#create should return a valid wallet instance if its given a valid mnemonic', () =>
  {
    // Arrange
    const mnemonic = "basic web ride board kingdom jacket interest remind sugar solution brick universe drive dignity live assume casual total nurse rotate gospel weasel remember good";
    const expected = "addr_test1qp6ttp6783q4d6mrnuqstlqrjpyrmyumfntewz4lsptn4489fpp48rgn9k8v5kf5jeqx8enfnqd0qa63zadp5tvhqdrqghug42";
    
    // Act
    const actual = _service.create(mnemonic).paymentAddress;
    
    // Assert
    expect(actual).toEqual(expected);
  });
});

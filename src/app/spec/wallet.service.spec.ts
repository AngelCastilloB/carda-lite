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
import { NetworkParameters } from '../models/networkParameters';
import { WalletService } from '../services/wallet.service';

import * as CardanoSerialization from '@emurgo/cardano-serialization-lib-asmjs'
import { Wallet } from '../models/wallet';

/* UTIL FUNCTIONS ************************************************************/

/**
 * Converts a byte array to a hex string.
 * 
 * @param bytes The bytes to be encoded into a hex string.
 * 
 * @returns The byte array.
 */
const toHex = ((bytes: any) =>
{
  return Buffer.from(bytes).toString("hex");
});

/**
 * Converts a hexadecimal string into a byte buffer.
 * 
 * @param hex the string to be converted.
 * 
 * @returns The byte array.
 */
const fromHex = ((hex: any)=>
{
  return Buffer.from(hex, "hex");
});

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

  it('#createTranscationBuilder should return a transaction builder from a set of network parameters ', () =>
  {
    // Arrange
    const expected = "a300800180021a000f4240";
    const dummyFee = "1000000";

    let params: NetworkParameters = new NetworkParameters(
            { minFeeA: "44", minFeeB: "155381" },
            "1000000",
            "500000000",
            "34482",
            "5000",
            "1000000",
            0.0577,
            0.0000721,
            16384);

    // Act
    const actual: CardanoSerialization.TransactionBuilder = _service.createTranscationBuilder(params);
    actual.set_fee(CardanoSerialization.BigNum.from_str(dummyFee));
    
    // Assert
    expect(toHex(actual.build().to_bytes())).toEqual(expected);
  });

  it('#createOutput should return a CDDL formatted output', () =>
  {
    // Arrange
    const dummyAddress          = "addr_test1qp8x8l9ldlmhf5s285fa2g74k0wfjskqztvqw7vda2x54qzwa5e343pw7w8d2d3sqh4uv7303r29mugnlj6uewhrcyvqr20x50";
    const dummmySerializedValue = "1a02625a00";
    const expected              = "825839004e63fcbf6ff774d20a3d13d523d5b3dc9942c012d807798dea8d4a804eed331ac42ef38ed5363005ebc67a2f88d45df113fcb5ccbae3c1181a02625a00";

    const value         = CardanoSerialization.Value.from_bytes(fromHex(dummmySerializedValue));
    const targetAddress = CardanoSerialization.Address.from_bech32(dummyAddress);

    let params: NetworkParameters = new NetworkParameters(
            { minFeeA: "44", minFeeB: "155381" },
            "1000000",
            "500000000",
            "34482",
            "5000",
            "1000000",
            0.0577,
            0.0000721,
            16384);

    // Act
    let cddlOutput: CardanoSerialization.TransactionOutput = _service.createOutput(targetAddress, value, params);
  
    // Assert
    expect(toHex(cddlOutput.to_bytes())).toEqual(expected);
  });

  it('#buildTransaction given valid parameters should return a CDDL formatted transaction', async () =>
  {
    // Arrange
    const dummyAddress         = "addr_test1qp8x8l9ldlmhf5s285fa2g74k0wfjskqztvqw7vda2x54qzwa5e343pw7w8d2d3sqh4uv7303r29mugnlj6uewhrcyvqr20x50";
    const dummmySerializedUtxo = "82825820091645e0a95479a4ae3bd7469b646a233cdf0ddefdad439bc50c386d813c9c7901825839004e63fcbf6ff774d20a3d13d523d5b3dc9942c012d807798dea8d4a804eed331ac42ef38ed5363005ebc67a2f88d45df113fcb5ccbae3c1181a2f03c633";
    const dummyWallet          = new Wallet(null, dummyAddress);   
    const amount               = 5000000; // In lovelace
    const expected             = "84a30081825820091645e0a95479a4ae3bd7469b646a233cdf0ddefdad439bc50c386d813c9c79010182825839004e63fcbf6ff774d20a3d13d523d5b3dc9942c012d807798dea8d4a804eed331ac42ef38ed5363005ebc67a2f88d45df113fcb5ccbae3c1181a01ba8140825839004e63fcbf6ff774d20a3d13d523d5b3dc9942c012d807798dea8d4a804eed331ac42ef38ed5363005ebc67a2f88d45df113fcb5ccbae3c1181a2d46b47e021a00029075a0f5f6";

    const utxos = [CardanoSerialization.TransactionUnspentOutput.from_bytes(fromHex(dummmySerializedUtxo))];

    let params: NetworkParameters = new NetworkParameters(
            { minFeeA: "44", minFeeB: "155381" },
            "1000000",
            "500000000",
            "34482",
            "5000",
            "1000000",
            0.0577,
            0.0000721,
            16384);

    // Act
    let cddlOutput: CardanoSerialization.Transaction = await _service.buildTransaction(dummyWallet, dummyAddress, amount, params, utxos);
  
    // Assert
    expect(toHex(cddlOutput.to_bytes())).toEqual(expected);
  });

  it('#signTransaction given wallet and a unsigned transaction should return a signed CDDL formatted transaction', async () =>
  {
    // Arrange
    const dummyUnsignTransaction = "84a30081825820091645e0a95479a4ae3bd7469b646a233cdf0ddefdad439bc50c386d813c9c79010182825839004e63fcbf6ff774d20a3d13d523d5b3dc9942c012d807798dea8d4a804eed331ac42ef38ed5363005ebc67a2f88d45df113fcb5ccbae3c1181a01ba8140825839004e63fcbf6ff774d20a3d13d523d5b3dc9942c012d807798dea8d4a804eed331ac42ef38ed5363005ebc67a2f88d45df113fcb5ccbae3c1181a2d46b47e021a00029075a0f5f6";
    const dummySeedPhrases       = "ginger tobacco ignore sheriff jelly clean leisure century cheese light lend attitude quality blur cage outer census earn visual hour leader special budget logic";
    const dummyWallet            = _service.create(dummySeedPhrases);   
    const expected               = "84a30081825820091645e0a95479a4ae3bd7469b646a233cdf0ddefdad439bc50c386d813c9c79010182825839004e63fcbf6ff774d20a3d13d523d5b3dc9942c012d807798dea8d4a804eed331ac42ef38ed5363005ebc67a2f88d45df113fcb5ccbae3c1181a01ba8140825839004e63fcbf6ff774d20a3d13d523d5b3dc9942c012d807798dea8d4a804eed331ac42ef38ed5363005ebc67a2f88d45df113fcb5ccbae3c1181a2d46b47e021a00029075a1008182582045b6303466fb162d81fe2943db5ab2c6eb7d1dbfcb40cbb6d2d9c8d4c8e65bf65840c4772a97fa575dcde2ac622f7b11a5a008eb94dd5e4201ee2f59eaf78ed299f623f9e3ff8c790e23327064fa15837d863c7ab1cab79b0acb6852dd49ef384e06f5f6";

    const transaction = CardanoSerialization.Transaction.from_bytes(fromHex(dummyUnsignTransaction));

    // Act
    let cddlOutput: CardanoSerialization.Transaction = await _service.signTransaction(dummyWallet, transaction);
  
    // Assert
    expect(cddlOutput.is_valid()).toBeTrue();
    expect(toHex(cddlOutput.to_bytes())).toEqual(expected);
  });
});
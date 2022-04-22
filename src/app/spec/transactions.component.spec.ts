/**
 * @file balance.component.spec.ts
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

import { Component }                                     from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { TransactionsComponent }                         from '../components/transactions/transactions.component';
import { MatCardModule }                                 from '@angular/material/card'
import { Transaction }                                   from '../models/transaction';
import { environment }                                   from 'src/environments/environment';

/* TESTS *********************************************************************/

@Component({ template: `
<ng-container>
<transactions  [transactions]="transactions"></transactions>
</ng-container>`})
class TestWrapperComponent {
    public transactions: Array<Transaction> = new Array<Transaction>();
}
describe('TransactionsComponent', () =>
{
    let component: TestWrapperComponent;
    let fixture: ComponentFixture<TestWrapperComponent>;
    const config: TestModuleMetadata =
    {
        declarations: [TransactionsComponent, TestWrapperComponent],
        imports: [MatCardModule]
    };

    beforeEach(async () =>
    {
        await TestBed.configureTestingModule(config).compileComponents();
    });

    beforeEach((): void =>
    {
        fixture = TestBed.createComponent(TestWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('the correct number of transactions must be rendered on the component', (): void =>
    {
        // Arrange
        const cssSelector: string = 'tr';
        const transactions = [new Transaction("asdasd", 1, 1, 1650616859, 1, 0.01), new Transaction("asdasd", 1, 1, 1650616859, 1, 0.01), new Transaction("asdasd", 1, 1, 1650616859, 1, 0.01)]
        const expected: number = transactions.length + 1 // Heading;

        // Act
        component.transactions = transactions;
        fixture.detectChanges();
        const elements = fixture.nativeElement.querySelectorAll(cssSelector);

        // Assert
        expect(elements.length).toEqual(expected);
    });

    it('the first column must be block time converted to valid equivalent date', (): void =>
    {
        // Arrange
        const cssSelector: string = 'td';
        const transactions = [new Transaction("asdasd", 1, 1, 1650616859, 1, 0.01)]
        const expected: string = "2022/Apr/22";

        // Act
        component.transactions = transactions;
        fixture.detectChanges();
        const elements = fixture.nativeElement.querySelectorAll(cssSelector);
        const dateColumn = elements[0];
        const actual: string = dateColumn.innerHTML.trim();

        // Assert   
        expect(actual).toEqual(expected);
    });

    it('the transaction explore link must point to the right url', (): void =>
    {
        // Arrange
        const cssSelector: string = 'a';
        const transactions = [new Transaction("transactionHash", 1, 1, 1650616859, 1, 0.01)]
        const expected: string = environment.cardanoScanIo + "/transactionHash";

        // Act
        component.transactions = transactions;
        fixture.detectChanges();
        const elements = fixture.nativeElement.querySelectorAll(cssSelector);
        const dateColumn = elements[0];
        const actual: string = dateColumn.href;

        // Assert   
        expect(actual).toEqual(expected);
    });

    it('the total amount must be formatted correctly', (): void =>
    {
        // Arrange
        const cssSelector: string = 'td';
        const transactions = [new Transaction("transactionHash", 1, 1, 1650616859, 1000000, 0.01)]
        const expected: string = "1.000000 ₳";

        // Act
        component.transactions = transactions;
        fixture.detectChanges();
        const elements = fixture.nativeElement.querySelectorAll(cssSelector);
        const dateColumn = elements[2];
        const actual: string = dateColumn.innerHTML.trim();

        // Assert   
        expect(actual).toEqual(expected);
    });

    it('the fee amount must be formatted correctly', (): void =>
    {
        // Arrange
        const cssSelector: string = 'td';
        const transactions = [new Transaction("transactionHash", 1, 1, 1650616859, 1000000, 320000)]
        const expected: string = "0.320000 ₳";

        // Act
        component.transactions = transactions;
        fixture.detectChanges();
        const elements = fixture.nativeElement.querySelectorAll(cssSelector);
        const dateColumn = elements[3];
        const actual: string = dateColumn.innerHTML.trim();

        // Assert   
        expect(actual).toEqual(expected);
    });
});
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
import { BalanceComponent }                              from '../components/balance/balance.component';
import { MatCardModule }                                 from '@angular/material/card'

/* TESTS *********************************************************************/

@Component({ template: `
<ng-container>
  <balance  [currentBalance]="currentBalance" (onRefresh)="onWallteRefresh()"></balance>
</ng-container>`})
class TestWrapperComponent {
    public currentBalance: number = 0;
    public eventTriggered: boolean = false;
    public onWallteRefresh(): void {
        this.eventTriggered = true;
    }
}
describe('BalanceComponent', () =>
{
    let component: TestWrapperComponent;
    let fixture: ComponentFixture<TestWrapperComponent>;
    const config: TestModuleMetadata =
    {
        declarations: [BalanceComponent, TestWrapperComponent],
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

    it('balance should be displayed with 6 decimal points', (): void =>
    {
        // Arrange
        const cssSelector: string = 'p';
        const element: HTMLSpanElement = fixture.nativeElement.querySelector(cssSelector);
        const expected: string = '0.000000';

        // Act
        fixture.detectChanges();
        const actual: string = element.innerHTML.trim();

        // Assert
        expect(actual).toContain(expected);
    });

    it('balance should be posfixed with ₳', (): void =>
    {
        // Arrange
        const cssSelector: string = 'p';
        const element: HTMLSpanElement = fixture.nativeElement.querySelector(cssSelector);
        const expected: string = '₳';

        // Act
        fixture.detectChanges();
        const actual: string = element.innerHTML.trim();

        // Assert
        expect(actual[actual.length-1]).toEqual(expected);
    });

    it('balance should be updated when the balance on parent changes', (): void =>
    {
        // Arrange
        const cssSelector: string = 'p';

        // Act
        fixture.detectChanges();

        component.currentBalance = 2000000;
        fixture.detectChanges();

        const element: HTMLSpanElement = fixture.nativeElement.querySelector(cssSelector);
        const expected: string = '2.000000 ₳';
        const actual: string = element.innerHTML.trim();

        // Assert
        expect(actual).toEqual(expected);
    });

    it('there must be a button with the label refresh', (): void =>
    {
        // Arrange
        const cssSelector: string = 'button';
        const element: HTMLSpanElement = fixture.nativeElement.querySelector(cssSelector);
        const expected: string = 'REFRESH';

        // Act
        fixture.detectChanges();
        const actual: string = element.innerHTML.trim();

        // Assert
        expect(actual).toEqual(expected);
    });

    it('refresh event must be emitted when the refresh button is clicked', (): void =>
    {
        // Arrange
        fixture.detectChanges();
        const cssSelector: string = 'button';
        const button: HTMLSpanElement = fixture.nativeElement.querySelector(cssSelector);

        // Act
        button.click();
        fixture.detectChanges();

        // Assert
        const actual: boolean = component.eventTriggered;
        expect(actual).toBeTrue();
    });
});
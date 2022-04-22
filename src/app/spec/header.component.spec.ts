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
import { HeaderComponent }                               from '../components/header/header.component';
import { MatToolbarModule }                              from '@angular/material/toolbar'
import { MatDialogModule }                               from '@angular/material/dialog'

/* TESTS *********************************************************************/

@Component({ template: `
<ng-container>
  <app-header [isWalletUnlocked]="isWalletUnlocked" (onLogout)="onLogout()"></app-header>
</ng-container>`})
class TestWrapperComponent {
    public isWalletUnlocked: boolean = false;
    public eventTriggered:   boolean = false;
    public onLogout(): void {
        this.eventTriggered = true;
    }
}
describe('HeaderComponent', () =>
{
    let component: TestWrapperComponent;
    let fixture: ComponentFixture<TestWrapperComponent>;
    const config: TestModuleMetadata =
    {
        declarations: [HeaderComponent, TestWrapperComponent],
        imports: [MatToolbarModule, MatDialogModule]
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

    it('should show a create wallet button when a wallet is not yet unlocked', (): void =>
    {
        // Arrange
        component.isWalletUnlocked = false;
        fixture.detectChanges();

        const cssSelector: string = 'button';
        const element: HTMLSpanElement = fixture.nativeElement.querySelector(cssSelector);
        const expected: string = 'Create Wallet';

        // Act
        fixture.detectChanges();
        const actual: string = element.innerHTML.trim();

        // Assert
        expect(actual).toEqual(expected);
    });

    it('should show a logout button when a wallet is currently unlocked', (): void =>
    {
        // Arrange
        component.isWalletUnlocked = true;
        fixture.detectChanges();

        const cssSelector: string = 'button';
        const element: HTMLSpanElement = fixture.nativeElement.querySelector(cssSelector);
        const expected: string = 'Logout';

        // Act
        fixture.detectChanges();
        const actual: string = element.innerHTML.trim();

        // Assert
        expect(actual).toEqual(expected);
    });

    it('Logout event must be emitted when the Logout button is clicked', (): void =>
    {
        // Arrange
        component.isWalletUnlocked = true;
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
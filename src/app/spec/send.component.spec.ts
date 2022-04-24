/**
 * @file send.component.spec.ts
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

import { Component, ViewChild }                          from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { SendComponent }                                 from '../components/send/send.component';
import { MatCardModule }                                 from '@angular/material/card'
import { FormsModule }                                   from '@angular/forms';
import { MatIconModule }                                 from '@angular/material/icon';
import { MatInputModule }                                from '@angular/material/input';
import { BrowserAnimationsModule }                       from '@angular/platform-browser/animations';

/* TESTS *********************************************************************/

@Component({ template: `
<ng-container>
  <send #sendComponent (onSend)="onSend($event)"></send>
</ng-container>`})
class TestWrapperComponent {
    @ViewChild('sendComponent', {static: true})
    public sendComponent: SendComponent;
    public eventTriggered: any;
    public onSend(event): void {
        this.eventTriggered = event;
    }
}
describe('SendComponent', () =>
{
    let component: TestWrapperComponent;
    let fixture: ComponentFixture<TestWrapperComponent>;
    const config: TestModuleMetadata =
    {
        declarations: [SendComponent, TestWrapperComponent],
        imports: [MatCardModule, FormsModule, MatIconModule, MatInputModule, BrowserAnimationsModule]
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

    it('should emit the receiving address and amount when send button is clicked', (): void =>
    {
        // Arrange
        let address = "addr_test1qp33a3t0c55efex8elq33fnjhde0d65s2l6plmuwhtknn24z2kd2plc9tlylxncqg8ssl5utwx6gvecyzspfj5djkhjqrsqeya";
        let amount  = 0;

        component.sendComponent._receivingAddress = address;
        component.sendComponent._amount = amount;

        // Act
        fixture.detectChanges();

        component.sendComponent.onSendClick();

        fixture.detectChanges();

        // Assert
        expect(component.eventTriggered.receivingAddress).toEqual(address);
        expect(component.eventTriggered.amount).toEqual(amount);
    });

    it('#keyPressNumbersWithDecimal should return true if key pressed is backspace (keycode 8)', (): void =>
    {
        // Arrange
        let key = { keyCode: 8 /*backspace*/, srcElement: { value: ""}}

        // Act
        let actual = component.sendComponent.keyPressNumbersWithDecimal(key);

        // Assert
        expect(actual).toBeTrue();
    });

    it('#keyPressNumbersWithDecimal should return true if key pressed is del (keycode 46)', (): void =>
    {
        // Arrange
        let key = { keyCode: 46 /*del*/, srcElement: { value: ""}}

        // Act
        let actual = component.sendComponent.keyPressNumbersWithDecimal(key);

        // Assert
        expect(actual).toBeTrue();
    });

    it('#keyPressNumbersWithDecimal should return true if key pressed is a number', (): void =>
    {
        // Act
        let actual = component.sendComponent.keyPressNumbersWithDecimal({ keyCode: 48, srcElement: { value: ""}}) && // The 0 key
                     component.sendComponent.keyPressNumbersWithDecimal({ keyCode: 49, srcElement: { value: ""}}) && // The 1 key
                     component.sendComponent.keyPressNumbersWithDecimal({ keyCode: 50, srcElement: { value: ""}}) && // The 2 key
                     component.sendComponent.keyPressNumbersWithDecimal({ keyCode: 51, srcElement: { value: ""}}) && // The 3 key
                     component.sendComponent.keyPressNumbersWithDecimal({ keyCode: 52, srcElement: { value: ""}}) && // The 4 key
                     component.sendComponent.keyPressNumbersWithDecimal({ keyCode: 53, srcElement: { value: ""}}) && // The 5 key
                     component.sendComponent.keyPressNumbersWithDecimal({ keyCode: 54, srcElement: { value: ""}}) && // The 6 key
                     component.sendComponent.keyPressNumbersWithDecimal({ keyCode: 55, srcElement: { value: ""}}) && // The 7 key
                     component.sendComponent.keyPressNumbersWithDecimal({ keyCode: 56, srcElement: { value: ""}}) && // The 8 key
                     component.sendComponent.keyPressNumbersWithDecimal({ keyCode: 57, srcElement: { value: ""}})    // The 9 key

        // Assert
        expect(actual).toBeTrue();
    });

    it('#keyPressNumbersWithDecimal should return false if key pressed is not a number', (): void =>
    {
        // Act
        let actual = component.sendComponent.keyPressNumbersWithDecimal({ keyCode: 65, srcElement: { value: ""}}); //The A key

        // Assert
        expect(actual).toBeFalse();
    });

    it('#keyPressNumbersWithDecimal should return true if a dot is pressed and there are no dots (keycode 46 same as del)', (): void =>
    {
        // Act
        let actual = component.sendComponent.keyPressNumbersWithDecimal({ keyCode: 46, srcElement: { value: "00000"}});

        // Assert
        expect(actual).toBeTrue();
    });

    it('#keyPressNumbersWithDecimal should return false if a dot is pressed and a dot is already present (keycode 46 same as del)', (): void =>
    {
        // Act
        let actual = component.sendComponent.keyPressNumbersWithDecimal({ keyCode: 46, srcElement: { value: "0.0000"}});

        // Assert
        expect(actual).toBeFalse();
    });
});
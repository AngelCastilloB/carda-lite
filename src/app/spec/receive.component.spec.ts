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
import { ReceiveComponent }                              from '../components/receive/receive.component';
import { MatCardModule }                                 from '@angular/material/card'
import { QRCodeModule }                                  from 'angular2-qrcode';

/* TESTS *********************************************************************/

@Component({ template: `
<ng-container>
    <receive  [address]="address"></receive>
</ng-container>`})
class TestWrapperComponent {
    public address: string = '';
}
describe('ReceiveComponent', () =>
{
    let component: TestWrapperComponent;
    let fixture: ComponentFixture<TestWrapperComponent>;
    const config: TestModuleMetadata =
    {
        declarations: [ReceiveComponent, TestWrapperComponent],
        imports: [MatCardModule, QRCodeModule]
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

    it('binded wallet address should be displayed correctly', (): void =>
    {
        // Arrange
        const address: string ='addr_test1qp33a3t0c55efex8elq33fnjhde0d65s2l6plmuwhtknn24z2kd2plc9tlylxncqg8ssl5utwx6gvecyzspfj5djkhjqrsqeya';
        component.address = address;

        const cssSelector: string = 'p';
        const element: HTMLSpanElement = fixture.nativeElement.querySelector(cssSelector);
        const expected: string = address;

        // Act
        fixture.detectChanges();
        const actual: string = element.innerHTML.trim();

        // Assert
        expect(actual).toContain(expected);
    });
});
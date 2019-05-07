import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { MessageComponent } from './message.component';
import { MatCardModule, MatIconModule, MatListModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { StatusMsg } from '../../assets/i18n/statusMsg';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('MessageComponent', () => {
    let component: MessageComponent;
    let fixture: ComponentFixture<MessageComponent>;

    let status: StatusMsg;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatCardModule,
                MatIconModule,
                MatListModule,
                RouterTestingModule
            ],
            providers: [
                StatusMsg
            ],
            declarations: [MessageComponent]
        }).compileComponents();

        status = TestBed.get(StatusMsg);

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MessageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // TODO: fix this issue
    // Failed: Uncaught (in promise): TypeError: Cannot read property 'removeControl' of undefined
    /*     xit('should be created', async(inject(
            [StatusMsg], (service) => {
                expect(service).toBeDefined();
            }))
        ); */

    xit('should create', () => {

        expect(component).toBeTruthy();
    });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageComponent } from './message.component';
import { MatCardModule, MatIconModule, MatListModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

import defaultMsgs from '../../assets/i18n/statusMsg.json';

fdescribe('MessageComponent', () => {
    let component: MessageComponent;
    let fixture: ComponentFixture<MessageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatCardModule,
                MatIconModule,
                MatListModule,
                RouterTestingModule
            ],
            declarations: [MessageComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MessageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

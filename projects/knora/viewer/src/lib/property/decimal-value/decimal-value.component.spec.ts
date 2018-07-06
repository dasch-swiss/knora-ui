import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecimalValueComponent } from './decimal-value.component';
import { MatFormFieldModule, MatInputModule, MatNativeDateModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DecimalValueComponent', () => {
    let component: DecimalValueComponent;
    let fixture: ComponentFixture<DecimalValueComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                MatFormFieldModule,
                MatInputModule
            ],
            declarations: [DecimalValueComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DecimalValueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

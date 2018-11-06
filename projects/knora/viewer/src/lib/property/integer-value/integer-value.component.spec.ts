import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegerValueComponent } from './integer-value.component';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('IntegerValueComponent', () => {
    let component: IntegerValueComponent;
    let fixture: ComponentFixture<IntegerValueComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                MatFormFieldModule,
                MatInputModule
            ],
            declarations: [IntegerValueComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IntegerValueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

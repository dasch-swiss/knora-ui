import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervalValueComponent } from './interval-value.component';
import { MatFormFieldModule, MatInputModule } from '@angular/material';

describe('IntervalValueComponent', () => {
    let component: IntervalValueComponent;
    let fixture: ComponentFixture<IntervalValueComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatFormFieldModule,
                MatInputModule
            ],
            declarations: [IntervalValueComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IntervalValueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalResValueComponent } from './external-res-value.component';
import { MatFormFieldModule, MatInputModule } from '@angular/material';

describe('ExternalResValueComponent', () => {
    let component: ExternalResValueComponent;
    let fixture: ComponentFixture<ExternalResValueComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatFormFieldModule,
                MatInputModule
            ],
            declarations: [ExternalResValueComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExternalResValueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

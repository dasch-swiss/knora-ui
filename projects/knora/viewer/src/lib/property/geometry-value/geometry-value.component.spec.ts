import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeometryValueComponent } from './geometry-value.component';
import { MatFormFieldModule, MatInputModule } from '@angular/material';

describe('GeometryValueComponent', () => {
    let component: GeometryValueComponent;
    let fixture: ComponentFixture<GeometryValueComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatFormFieldModule,
                MatInputModule
            ],
            declarations: [GeometryValueComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GeometryValueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

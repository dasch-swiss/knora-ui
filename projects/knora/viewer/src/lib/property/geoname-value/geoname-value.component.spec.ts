import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeonameValueComponent } from './geoname-value.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

describe('GeonameValueComponent', () => {
    let component: GeonameValueComponent;
    let fixture: ComponentFixture<GeonameValueComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatFormFieldModule,
                MatInputModule
            ],
            declarations: [GeonameValueComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GeonameValueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

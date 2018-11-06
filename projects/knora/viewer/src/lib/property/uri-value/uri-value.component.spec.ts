import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UriValueComponent } from './uri-value.component';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UriValueComponent', () => {
    let component: UriValueComponent;
    let fixture: ComponentFixture<UriValueComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                MatFormFieldModule,
                MatInputModule
            ],
            declarations: [UriValueComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UriValueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

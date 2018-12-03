import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MainHeaderComponent} from './main-header.component';
import {MatIconModule, MatToolbarModule} from '@angular/material';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('MainHeaderComponent', () => {
    let component: MainHeaderComponent;
    let fixture: ComponentFixture<MainHeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatToolbarModule,
                MatIconModule,
                HttpClientTestingModule
            ],
            declarations: [MainHeaderComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

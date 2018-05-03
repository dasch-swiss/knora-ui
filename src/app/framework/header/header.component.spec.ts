import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HeaderComponent} from './header.component';
import {MatIconModule} from '@angular/material';
import {AppDemo} from '../../app.config';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatIconModule
            ],
            declarations: [HeaderComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create a header', () => {
        expect(component).toBeTruthy();
    });

    /*
    it(`should have a title`, async(() => {
        expect(component.demo).toEqual(AppDemo.actionModule);
    }));
    */
});

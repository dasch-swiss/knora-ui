import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StringifyStringLiteralComponent } from './stringify-string-literal.component';

describe('StringLiteralComponent', () => {
    let component: StringifyStringLiteralComponent;
    let fixture: ComponentFixture<StringifyStringLiteralComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StringifyStringLiteralComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StringifyStringLiteralComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

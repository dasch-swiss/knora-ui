import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TextValueAsXmlComponent } from './text-value-as-xml.component';
import { ReadTextValueAsXml } from '@knora/core';

describe('TextValueAsXmlComponent', () => {
    let component: TextValueAsXmlComponent;
    let fixture: ComponentFixture<TextValueAsXmlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TextValueAsXmlComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TextValueAsXmlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

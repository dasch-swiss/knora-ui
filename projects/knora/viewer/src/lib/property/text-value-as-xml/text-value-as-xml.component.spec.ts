import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TextValueAsXmlComponent } from './text-value-as-xml.component';

describe('TextValueAsXmlComponent', () => {
    let component: TextValueAsXmlComponent;
    let fixture: ComponentFixture<TextValueAsXmlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TextValueAsXmlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});

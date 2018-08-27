import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadTextValueAsHtmlComponent } from './text-value-as-html.component';

describe('ReadTextValueAsHtmlComponent', () => {
    let component: ReadTextValueAsHtmlComponent;
    let fixture: ComponentFixture<ReadTextValueAsHtmlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ReadTextValueAsHtmlComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReadTextValueAsHtmlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });
});

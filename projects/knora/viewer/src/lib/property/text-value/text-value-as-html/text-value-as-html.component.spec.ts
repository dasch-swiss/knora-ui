import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatSnackBarModule } from '@angular/material';
import { TextValueAsHtmlComponent } from './text-value-as-html.component';
import { OntologyInformation, ReadTextValueAsHtml } from '@knora/core';
import { MathJaxDirective } from '@knora/action';

describe('TextValueAsHtmlComponent', () => {
    let component: TextValueAsHtmlComponent;
    let fixture: ComponentFixture<TextValueAsHtmlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatDialogModule, MatSnackBarModule],
            declarations: [
                TextValueAsHtmlComponent,
                MathJaxDirective
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TextValueAsHtmlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

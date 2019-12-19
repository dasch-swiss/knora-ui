import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StringLiteralInputComponent } from './string-literal-input.component';

describe('StringLiteralInputComponent', () => {
    let component: StringLiteralInputComponent;
    let fixture: ComponentFixture<StringLiteralInputComponent>;

    const formBuilder: FormBuilder = new FormBuilder();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatMenuModule,
                MatInputModule,
                MatIconModule,
                MatButtonToggleModule,
                MatFormFieldModule,
                BrowserAnimationsModule,
                ReactiveFormsModule
            ],
            declarations: [
                StringLiteralInputComponent
            ],
            providers: [
                {
                    provide: FormBuilder,
                    useValue: formBuilder
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StringLiteralInputComponent);
        component = fixture.componentInstance;
        component.form = formBuilder.group({
            text: ['', false]
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonToggleModule, MatFormFieldModule, MatInputModule, MatMenuModule, MatIconModule } from '@angular/material';
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
            text: null
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

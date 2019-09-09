import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule, MatFormFieldModule, MatInputModule, MatMenuModule, MatIconModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StringLiteralInputComponent } from './string-literal-input.component';

describe('StringLiteralInputComponent', () => {
    let component: StringLiteralInputComponent;
    let fixture: ComponentFixture<StringLiteralInputComponent>;

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
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StringLiteralInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

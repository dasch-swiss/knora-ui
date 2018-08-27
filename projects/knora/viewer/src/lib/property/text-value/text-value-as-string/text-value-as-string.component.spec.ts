import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadTextValueAsStringComponent } from './text-value-as-string.component';

describe('ReadTextValueAsStringComponent', () => {
    let component: ReadTextValueAsStringComponent;
    let fixture: ComponentFixture<ReadTextValueAsStringComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReadTextValueAsStringComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    xit('should create', () => {
        expect(component).toBeTruthy();
    });

});

import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {KuiActionModule} from '@knora/action';
import {SortButtonComponent} from './sort-button.component';

describe('SortButtonComponent', () => {
    let component: SortButtonComponent;
    let fixture: ComponentFixture<SortButtonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                KuiActionModule
            ],
            declarations: [
                SortButtonComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SortButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

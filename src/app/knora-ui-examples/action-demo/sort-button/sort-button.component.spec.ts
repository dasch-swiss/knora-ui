import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule, MatDividerModule, MatIconModule, MatTabsModule } from '@angular/material';
import { KuiActionModule } from '@knora/action';
import { SortButtonComponent } from './sort-button.component';
import { ExampleViewerComponent } from '../../../partials/example-viewer/example-viewer.component';


describe('SortButtonComponent', () => {
    let component: SortButtonComponent;
    let fixture: ComponentFixture<SortButtonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                KuiActionModule,
                MatCardModule,
                MatDividerModule,
                MatTabsModule,
                MatIconModule,
                RouterTestingModule
            ],
            declarations: [
                ExampleViewerComponent,
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

import { MatIconModule, MatCardModule, MatDividerModule, MatTabsModule } from '@angular/material';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { KuiActionModule } from '@knora/action';
import { SortButtonComponent } from './sort-button.component';
import { ModuleSubHeaderComponent } from '../../../partials/module-sub-header/module-sub-header.component';
import { ExampleViewerComponent } from 'docs/app/partials/example-viewer/example-viewer.component';
import { RouterTestingModule } from '@angular/router/testing';

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
                ModuleSubHeaderComponent,
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

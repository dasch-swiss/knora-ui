import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatCardModule, MatIconModule, MatListModule, MatTabsModule} from '@angular/material';
import {KuiActionModule} from '@knora/action';

import {ModuleHeaderComponent} from '../../../partials/module-header/module-header.component';
import {ProgressIndicatorComponent} from './progress-indicator.component';
import {ExampleViewerComponent} from '../../../partials/example-viewer/example-viewer.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {MarkdownModule} from 'ngx-markdown';


describe('ProgressIndicatorDemoComponent', () => {
    let component: ProgressIndicatorComponent;
    let fixture: ComponentFixture<ProgressIndicatorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                KuiActionModule,
                MatCardModule,
                MatIconModule,
                MatListModule,
                MatTabsModule,
                MarkdownModule.forRoot({loader: HttpClient})
            ],
            declarations: [
                ExampleViewerComponent,
                ModuleHeaderComponent,
                ProgressIndicatorComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProgressIndicatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

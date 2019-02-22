import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule, MatIconModule, MatListModule, MatTabsModule } from '@angular/material';

import { KuiActionModule } from '@knora/action';
import { ProgressIndicatorComponent } from './progress-indicator.component';
import { ExampleViewerComponent } from '../../../partials/example-viewer/example-viewer.component';

import { MarkdownModule } from 'ngx-markdown';


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
                MarkdownModule.forRoot({loader: HttpClient}),
                RouterTestingModule
            ],
            declarations: [
                ExampleViewerComponent,
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

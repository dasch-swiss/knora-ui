import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {MatCardModule, MatChipsModule, MatDividerModule, MatIconModule, MatInputModule, MatTabsModule} from '@angular/material';
import {KuiActionModule} from '@knora/action';
import {KuiCoreModule} from '@knora/core';

import {ProjectsComponent} from './projects.component';
import {ExampleViewerComponent} from '../../../partials/example-viewer/example-viewer.component';
import {MarkdownModule} from 'ngx-markdown';
import {ModuleHeaderComponent} from '../../../partials/module-header/module-header.component';

describe('ProjectsComponent', () => {
    let component: ProjectsComponent;
    let fixture: ComponentFixture<ProjectsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatCardModule,
                MatChipsModule,
                MatDividerModule,
                MatInputModule,
                MatIconModule,
                MatTabsModule,
                KuiCoreModule,
                KuiActionModule,
                MarkdownModule.forRoot({ loader: HttpClient }),
                HttpClientModule
            ],
            declarations: [
                ExampleViewerComponent,
                ModuleHeaderComponent,
                ProjectsComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

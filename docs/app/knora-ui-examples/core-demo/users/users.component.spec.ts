import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UsersComponent} from './users.component';
import {MatCardModule, MatDividerModule, MatIconModule, MatInputModule, MatTabsModule} from '@angular/material';
import {KuiCoreModule} from '@knora/core';
import {ExampleViewerComponent} from '../../../partials/example-viewer/example-viewer.component';
import {MarkdownModule} from 'ngx-markdown';
import {HttpClient} from '@angular/common/http';
import {KuiProgressIndicatorModule} from '../../../../../projects/knora/progress-indicator/src/lib/progress-indicator.module';
import {ModuleHeaderComponent} from '../../../partials/module-header/module-header.component';

describe('UsersComponent', () => {
    let component: UsersComponent;
    let fixture: ComponentFixture<UsersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatCardModule,
                MatDividerModule,
                MatInputModule,
                MatIconModule,
                MatTabsModule,
                KuiCoreModule,
                KuiProgressIndicatorModule,
                MarkdownModule.forRoot({ loader: HttpClient })
            ],
            declarations: [
                ExampleViewerComponent,
                ModuleHeaderComponent,
                UsersComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UsersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

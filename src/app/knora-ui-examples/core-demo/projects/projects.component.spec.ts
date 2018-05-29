import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {MatCardModule, MatChipsModule, MatDividerModule, MatInputModule} from '@angular/material';
import {KuiCoreModule, KuiCoreConfig} from '@knora/core';

import {ProjectsComponent} from './projects.component';

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
                KuiCoreModule,
                HttpClientModule
            ],
            declarations: [ProjectsComponent]
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

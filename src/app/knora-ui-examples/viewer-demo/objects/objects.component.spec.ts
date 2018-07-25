import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material';

import { ObjectsComponent } from './objects.component';
import { ModuleSubHeaderComponent } from '../../../partials/module-sub-header/module-sub-header.component';
import { KuiViewerModule } from '../../../../../projects/knora/viewer/src/lib/viewer.module';

describe('ObjectsComponent', () => {
    let component: ObjectsComponent;
    let fixture: ComponentFixture<ObjectsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                KuiViewerModule,
                MatIconModule,
                RouterTestingModule
            ],
            declarations: [
                ObjectsComponent,
                ModuleSubHeaderComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ObjectsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

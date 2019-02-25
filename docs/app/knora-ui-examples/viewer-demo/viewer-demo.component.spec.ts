import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerDemoComponent } from './viewer-demo.component';
import { ModuleHeaderComponent } from '../../partials/module-header/module-header.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ViewerDemoComponent', () => {
    let component: ViewerDemoComponent;
    let fixture: ComponentFixture<ViewerDemoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [
                ModuleHeaderComponent,
                ViewerDemoComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewerDemoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsComponent } from './views.component';
import { RouterTestingModule } from '@angular/router/testing';

import { KuiViewerModule } from '@knora/viewer';
import { MatIconModule } from '@angular/material';


describe('ViewsComponent', () => {
    let component: ViewsComponent;
    let fixture: ComponentFixture<ViewsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                KuiViewerModule,
                MatIconModule,
                RouterTestingModule
            ],
            declarations: [
                ViewsComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

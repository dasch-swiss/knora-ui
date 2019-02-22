import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material';

import { PropertiesComponent } from './properties.component';
import { KuiViewerModule } from '@knora/viewer';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PropertiesComponent', () => {
    let component: PropertiesComponent;
    let fixture: ComponentFixture<PropertiesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                KuiViewerModule,
                MatIconModule,
                RouterTestingModule
            ],
            declarations: [
                PropertiesComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertiesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesViewComponent } from './properties-view.component';
import { MatCardModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { KuiCoreModule } from '@knora/core';

describe('PropertiesViewComponent', () => {
    let component: PropertiesViewComponent;
    let fixture: ComponentFixture<PropertiesViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                KuiCoreModule,
                MatCardModule
            ],
            declarations: [PropertiesViewComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertiesViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

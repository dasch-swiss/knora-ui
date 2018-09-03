import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule, MatTooltipModule } from '@angular/material';
import { KuiCoreModule } from '@knora/core';
import { KuiActionModule } from '@knora/action';

import { ResourceComponent } from './resource.component';

describe('ResourceComponent', () => {
    let component: ResourceComponent;
    let fixture: ComponentFixture<ResourceComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                KuiCoreModule,
                MatListModule,
                MatTooltipModule,
                KuiActionModule
            ],
            declarations: [ResourceComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

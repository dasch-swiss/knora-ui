import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleHeaderComponent } from './module-header.component';
import { MatIconModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

describe('ModuleHeaderComponent', () => {
    let component: ModuleHeaderComponent;
    let fixture: ComponentFixture<ModuleHeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatIconModule,
                RouterTestingModule
            ],
            declarations: [ModuleHeaderComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModuleHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

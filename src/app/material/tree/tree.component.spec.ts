import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TreeComponent} from './tree.component';
import {MatIconModule, MatTreeModule} from '@angular/material';

describe('TreeComponent', () => {
    let component: TreeComponent;
    let fixture: ComponentFixture<TreeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatIconModule,
                MatTreeModule
            ],
            declarations: [
                TreeComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TreeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

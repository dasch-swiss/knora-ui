import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KuiCoreModule } from '@knora/core';

import { ListsComponent } from './lists.component';

describe('ListsComponent', () => {
    let component: ListsComponent;
    let fixture: ComponentFixture<ListsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                KuiCoreModule
            ],
            declarations: [
                ListsComponent
            ]

        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

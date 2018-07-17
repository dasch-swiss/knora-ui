import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListValueComponent } from './list-value.component';
import { MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';

describe('ListValueComponent', () => {
    let component: ListValueComponent;
    let fixture: ComponentFixture<ListValueComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatFormFieldModule,
                MatSelectModule
            ],
            declarations: [ListValueComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListValueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

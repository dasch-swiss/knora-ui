import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExampleViewerComponent} from './example-viewer.component';
import {MatCardModule, MatDividerModule, MatIconModule, MatTabsModule} from '@angular/material';

describe('ExampleViewerComponent', () => {
    let component: ExampleViewerComponent;
    let fixture: ComponentFixture<ExampleViewerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatCardModule,
                MatDividerModule,
                MatIconModule,
                MatTabsModule
            ],
            declarations: [ExampleViewerComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExampleViewerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

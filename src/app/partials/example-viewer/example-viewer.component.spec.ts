import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExampleViewerComponent} from './example-viewer.component';
import {MatButtonModule, MatCardModule, MatDividerModule, MatIconModule, MatTabsModule} from '@angular/material';

describe('ExampleViewerComponent', () => {
    let component: ExampleViewerComponent;
    let fixture: ComponentFixture<ExampleViewerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatButtonModule,
                MatCardModule,
                MatDividerModule,
                MatIconModule,
                MatTabsModule
            ],
            declarations: [
                ExampleViewerComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExampleViewerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        component.example = {
            title: 'Classic Loader',
            subtitle: '',
            name: 'classicLoader',
            code: {
                html: `<kui-progress-indicator></kui-progress-indicator>`,
                ts: '',
                scss: ''
            }
        };

        expect(component).toBeTruthy();
//        expect(fixture.nativeElement.querySelector('mat-card-title').innerText).toEqual('');

    });
});

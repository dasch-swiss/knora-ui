import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleViewerComponent } from './example-viewer.component';
import { MatButtonModule, MatCardModule, MatDividerModule, MatIconModule, MatTabsModule } from '@angular/material';

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

    it('should create the framework without content', () => {
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
        expect(fixture.nativeElement.querySelector('mat-card-title').innerText).toEqual('');
    });

    it('should display original title after detectChanges()', () => {
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

        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('mat-card-title').innerText).toEqual('Classic Loader');

    });
});

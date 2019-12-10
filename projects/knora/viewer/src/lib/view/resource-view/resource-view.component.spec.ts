import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabsModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GndDirective, KeyPipe, MessageComponent, ProgressIndicatorComponent } from '@knora/action';
import { KnoraApiConfig, KnoraApiConnection } from '@knora/api';
import { KnoraApiConnectionToken } from '@knora/core';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { StillImageComponent } from '../../resource/still-image/still-image.component';
import { PropertiesToolbarComponent } from '../properties-view/properties-toolbar/properties-toolbar.component';
import { PropertiesViewComponent } from '../properties-view/properties-view.component';

import { ResourceViewComponent } from './resource-view.component';

describe('ResourceViewComponent', () => {
    let component: ResourceViewComponent;
    let fixture: ComponentFixture<ResourceViewComponent>;

    const config = new KnoraApiConfig('http', '0.0.0.0', 3333);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                RouterTestingModule.withRoutes([]),
                MatCardModule,
                MatListModule,
                MatIconModule,
                MatToolbarModule,
                MatCheckboxModule,
                MatTabsModule
            ],
            declarations: [
                ResourceViewComponent,
                PropertiesViewComponent,
                StillImageComponent,
                KeyPipe,
                GndDirective,
                ProgressIndicatorComponent,
                MessageComponent,
                PropertiesToolbarComponent
            ],
            providers: [
                {
                    provide: KnoraApiConnectionToken,
                    useValue: new KnoraApiConnection(config)
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: null
                    },
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatListModule, MatTabsModule } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { KeyPipe, ProgressIndicatorComponent } from '@knora/action';
import { KuiCoreConfig } from '@knora/core';
import { SearchResultsComponent } from './search-results.component';
import { ListViewComponent } from '../list-view/list-view.component';
import { GridViewComponent } from '../grid-view/grid-view.component';
import { TableViewComponent } from '../table-view/table-view.component';
import { GraphViewComponent } from '../graph-view/graph-view.component';
import { TextValueAsHtmlComponent } from '../../property/text-value/text-value-as-html/text-value-as-html.component';
import { DateValueComponent } from '../../property/date-value/date-value.component';
import { of } from 'rxjs';

describe('SearchResultsComponent', () => {
    let component: SearchResultsComponent;
    let fixture: ComponentFixture<SearchResultsComponent>;

    const mode = 'extended';
    const q = 'test';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatIconModule,
                MatListModule,
                MatTabsModule,
                HttpClientModule,
                HttpClientTestingModule,
                RouterTestingModule
            ],
            declarations: [
                DateValueComponent,
                KeyPipe,
                ListViewComponent,
                ProgressIndicatorComponent,
                SearchResultsComponent,
                TextValueAsHtmlComponent,
                GridViewComponent,
                TableViewComponent,
                GraphViewComponent
            ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: of({
                            get: (param: string) => {
                                if (param === 'q') {
                                    return q;
                                } else {
                                    return mode;
                                }
                            }
                        })
                    }
                },
                {
                    provide: 'config',
                    useValue: KuiCoreConfig
                },
                HttpClient
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchResultsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

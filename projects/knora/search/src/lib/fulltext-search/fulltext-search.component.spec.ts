import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReversePipe } from '@knora/action';
import { FulltextSearchComponent } from './fulltext-search.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { KuiCoreConfig, KuiCoreConfigToken } from '@knora/core';

describe('FulltextSearchComponent', () => {
    let component: FulltextSearchComponent;
    let fixture: ComponentFixture<FulltextSearchComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                HttpClientModule,
                MatIconModule,
                MatInputModule,
                MatListModule,
                MatMenuModule,
                FormsModule,
                RouterTestingModule,
                BrowserAnimationsModule
            ],
            declarations: [FulltextSearchComponent, ReversePipe],
            providers: [
                {
                    provide: KuiCoreConfigToken,
                    useValue: KuiCoreConfig
                },
                HttpClient,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: null
                    }
                }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FulltextSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

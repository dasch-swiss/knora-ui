import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkValueComponent } from './link-value.component';
import { MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { KnoraConstants, OntologyInformation, ReadLinkValue } from '@knora/core';
import { ResourceDialogComponent } from '@knora/action';

describe('LinkValueComponent', () => {
    let component: LinkValueComponent;
    let fixture: ComponentFixture<LinkValueComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatFormFieldModule,
                MatIconModule,
                MatInputModule,
                MatDialogModule
            ],
            declarations: [LinkValueComponent, ResourceDialogComponent],
            providers: [
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LinkValueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { KuiCoreModule } from '@knora/core';

import { AuthGuard } from './auth.guard';


xdescribe('AuthGuard', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                RouterTestingModule,
                HttpClientTestingModule,
                KuiCoreModule.forRoot({ name: '', api: '', app: '', media: '', ontologyIRI: '' })
            ],
            providers: [
                AuthGuard
            ]
        });
    });

    it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
        expect(guard).toBeTruthy();
    }));
});

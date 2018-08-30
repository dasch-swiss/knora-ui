import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { KuiCoreModule } from '@knora/core';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                RouterTestingModule,
                KuiCoreModule.forRoot({name: '', api: '', app: '', media: ''})
            ],
            providers: [
                AuthGuard,
                HttpClient,
                HttpHandler
            ]
        });
    });

    it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
        expect(guard).toBeTruthy();
    }));
});

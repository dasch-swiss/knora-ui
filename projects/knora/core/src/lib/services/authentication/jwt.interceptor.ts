import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KuiCoreModule } from '../../core.module';

@Injectable({
    providedIn: KuiCoreModule
})
export class JwtInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // add authorization header with jwt token if available
        const sessionId = JSON.parse(localStorage.getItem('session_id'));

        const token: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ3ZWJhcGkiLCJzdWIiOiJodHRwOi8vcmRmaC5jaC91c2Vycy9yb290IiwiYXVkIjoid2ViYXBpIiwiaWF0IjoxNTMzNTY2MjgzLCJleHAiOjE1MzM1NjYyODgsImp0aSI6ImVhZmNhOTFiLWUxMWEtNDUwNS05OWFiLTE2YTA2YWYxZjlkNSJ9.VgTNvTpAS0PGCuTR5wfr6jKnGlVS9aAUsaIW1ndSprw';

        if (sessionId) {
            // get token from cache service
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(request);
    }
}

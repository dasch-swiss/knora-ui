import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { KuiAuthenticationModule } from './authentication.module';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: KuiAuthenticationModule
})
export class AuthenticationInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>,
              next: HttpHandler): Observable<HttpEvent<any>> {

        const idToken = localStorage.getItem('id_token');

        if (idToken) {
            const cloned = req.clone({
                headers: req.headers.set('Authorization',
                    'Bearer ' + idToken)
            });

            return next.handle(cloned);
        } else {
            return next.handle(req);
        }
    }
}

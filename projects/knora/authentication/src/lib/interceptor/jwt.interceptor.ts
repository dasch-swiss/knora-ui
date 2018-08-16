import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const session = JSON.parse(localStorage.getItem('session'));
        // TODO: check if the session is still valid, by comparing it with current time and the max session time; if it's false, check the api authentication /v2/authentication; if this is still true, set the new session id; a session is valid for 5 days by default
        if (session && session.user.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${session.user.token}`
                }
            });
        }

        return next.handle(request);
    }
}

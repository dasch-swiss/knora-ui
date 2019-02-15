import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionService } from '../session/session.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private _session: SessionService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available

        if (this._session.validateSession()) {
            // the session is valid (and up to date)
            const jwt = JSON.parse(localStorage.getItem('session')).user.jwt;
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${jwt}`
                },
                withCredentials: true
            });
        } else {
            this._session.destroySession();
        }

        return next.handle(request);
    }
}

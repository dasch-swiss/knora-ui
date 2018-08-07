import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentUser } from '../../declarations';
import { AuthenticationCacheService } from './authentication-cache.service';

@Injectable({
    providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {

    token: string;

    constructor(private _acs: AuthenticationCacheService) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // add authorization header with jwt token if available
        const sessionId = JSON.parse(localStorage.getItem('session_id'));


        this._acs.getData().subscribe(
            (result: CurrentUser) => {
                this.token = result.token;
            },
            (error: any) => {
                console.error(error);
            }
        );

        if (sessionId) {
            // get token from cache service
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + this.token
                }
            });
        }

        return next.handle(request);
    }
}

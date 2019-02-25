import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionService } from '../session/session.service';

@Injectable()
export class WithCredentialsInterceptor implements HttpInterceptor {

    constructor(private _session: SessionService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available

        // console.log('WithCredentialsInterceptor - intercept - request: ', request);

        request = request.clone({
            withCredentials: true
        });

        return next.handle(request);
    }
}

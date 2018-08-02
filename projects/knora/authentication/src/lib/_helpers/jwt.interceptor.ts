import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // add authorization header with jwt token if available
        const idToken = JSON.parse(localStorage.getItem('token_id'));

        if (idToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${idToken}`
                }
            });
        }

        return next.handle(request);
    }
}

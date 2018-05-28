import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {KuiCoreModule} from '../core.module';

@Injectable({
    providedIn: KuiCoreModule
})
export class AuthInterceptor implements HttpInterceptor {
    constructor() {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${localStorage.get('currentUser').token}`

//                JSON.parse(localStorage.getItem('currentUser')).token;
            }
        });

        return next.handle(req);
    }
}

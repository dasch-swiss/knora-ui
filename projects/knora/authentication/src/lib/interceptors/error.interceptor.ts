import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// import { AuthenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {
    /*
    constructor(private _authService: AuthenticationService) {
    }
*/
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {

            // console.log('authentication -- error.interceptor', err);

            if (err.status === 401) {
                // auto logout if 401 response returned from api
                //                this._authService.logout();
                // the following location.reload is used for the auth.guard in app routing
                // to go to the login page
                //                location.reload(true);
            }


            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }
}

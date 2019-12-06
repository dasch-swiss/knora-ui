import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KuiConfigToken } from '@knora/core';

@Injectable({
    providedIn: 'root'
})
export class StatusMsgService {

    constructor(private _http: HttpClient,
        @Inject(KuiConfigToken) public config) {
    }

    /**
    * this method get the status messages from the statusMsg.json file
    * which are defined here: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
    * and here: http://www.w3schools.com/tags/ref_httpmessages.asp
    *
    */
    getStatusMsg(): Observable<any> {

        return this._http.get(this.config.app.url + '/assets/i18n/statusMsg.json')
            .pipe(map(
                (res: any) => {
                    return res;
                },
                err => {
                    console.error(err);
                }
            )
            );

    }
}

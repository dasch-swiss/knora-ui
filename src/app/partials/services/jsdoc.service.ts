import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class JsdocService {

    path: string = 'data/documentation/';

    constructor(private _http: HttpClient) {
    }

    readJson(module: string, name: string) {
        const file = this.path + module + '/' + name + '.doc.json';
        return this._http.get(file);
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/do';

import { KuiCoreConfig } from '../../projects/knora/core/src/lib/declarations';
import { environment } from '../environments/environment';

export interface IAppConfig {

    env: {
        name: string;
    };
    ontologyIRI: string;
    apiURL: string;
    externalApiURL: string;
    iiifURL: string;
    appURL: string;
    appName: string;
    localData: string;
    pagingLimit: number;
    startComponent: string;
    firebase: {
        apiKey: string;
        authDomain: string;
        databaseURL: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;

    };
}

@Injectable()
export class AppConfig extends KuiCoreConfig {

    // settings: IAppConfig;

    constructor(private _http: HttpClient) {
        super();
        console.log('AppConfig constructor');
    }

    loadAppConfig(): Promise<void> {

        const jsonFile = `config/config.${environment.name}.json`;

        return this._http.get(jsonFile).toPromise().then(
            (data: IAppConfig) => {
                // this.settings = data;
                this.api = data.apiURL;
                console.log(data);
            },
            (error: any) => {
                console.error(error);
            }
        );


        /*
        return this._http.get<IAppConfig>(jsonFile)
            .do(data => {
                AppConfig.settings = data;
                AppConfig.apiUrl = data.apiURL;
                //this.config.api = data.apiURL;
                console.log('AppConfig.settings = ', AppConfig.settings);
            })
            .toPromise();*/
    }
}

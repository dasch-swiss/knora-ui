import { Injectable } from '@angular/core';
import { KuiCoreConfig } from '../../projects/knora/core/src/lib/declarations';
import { HttpClient } from '@angular/common/http';
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
}

@Injectable({
    providedIn: 'root'
})
export class AppInitService {

    private appConfig: IAppConfig;
    private coreConfig: KuiCoreConfig;

    constructor(private http: HttpClient) { }

    loadAppConfig() {
        return this.http.get(`config/config.${environment.name}.json`)
            .toPromise()
            .then(data => {

                console.log('AppInitService - loadAppConfig - data: ', data);

                this.appConfig = <IAppConfig> data;

                this.coreConfig = <KuiCoreConfig> {
                    name: this.appConfig.appName,
                    api: this.appConfig.apiURL,
                    media: this.appConfig.iiifURL,
                    app: this.appConfig.appURL
                };
            });
    }

    getAppConfig() {
        return this.appConfig;
    }

    getCoreConfig() {
        return this.coreConfig;
    }
}

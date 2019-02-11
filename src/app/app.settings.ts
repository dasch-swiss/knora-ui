import { Injectable } from '@angular/core';

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

@Injectable()
export class AppSettings {

    static settings: IAppConfig;

    constructor() {
        const data = <IAppConfig> window['tempConfigStorage'];
        console.log('AppSettings constructor: json', data);
        AppSettings.settings = data;
    }

}



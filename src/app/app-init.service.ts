import { Injectable } from '@angular/core';
import { KnoraApiConfig, KnoraApiConnection } from '@knora/api';
import { KnoraUiConfig } from '@knora/core';

@Injectable()
export class AppInitService {

    static knoraApiConnection: KnoraApiConnection;

    static knoraUiConfig: KnoraUiConfig;

    // appConfig: KnoraUiConfig;

    constructor() { }

    Init() {

        return new Promise<void>((resolve, reject) => {
            // console.log('AppInitService.init() called');
            // do your initialisation stuff here

            const data = window['tempConfigStorage'] as KnoraUiConfig;

            AppInitService.knoraUiConfig = data;

            const config: KnoraApiConfig = new KnoraApiConfig(
                AppInitService.knoraUiConfig.api.protocol,
                AppInitService.knoraUiConfig.api.host,
                AppInitService.knoraUiConfig.api.port
            );

            AppInitService.knoraApiConnection = new KnoraApiConnection(config);

            // console.log('AppInitService: finished');

            resolve();
        });
    }
}

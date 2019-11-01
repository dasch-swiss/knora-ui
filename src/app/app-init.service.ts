import { Injectable } from '@angular/core';
import { KnoraApiConfig, KnoraApiConnection } from '@knora/api';
import { KuiConfig } from '@knora/core';

@Injectable()
export class AppInitService {

    static knoraApiConnection: KnoraApiConnection;

    static kuiConfig: KuiConfig;

    constructor() { }

    Init() {

        return new Promise<void>((resolve, reject) => {
            // console.log('AppInitService.init() called');
            // do your initialisation stuff here

            const data = window['tempConfigStorage'] as KuiConfig;

            AppInitService.kuiConfig = data;

            const config: KnoraApiConfig = new KnoraApiConfig(
                AppInitService.kuiConfig.api.protocol,
                AppInitService.kuiConfig.api.host,
                AppInitService.kuiConfig.api.port
            );

            AppInitService.knoraApiConnection = new KnoraApiConnection(config);

            // console.log('AppInitService: finished');

            resolve();
        });
    }
}

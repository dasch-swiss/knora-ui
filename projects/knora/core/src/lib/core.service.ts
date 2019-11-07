import { Inject, Injectable } from '@angular/core';

import { KuiConfig } from './core.config';
import { KuiConfigToken } from './core.module';

@Injectable({
    providedIn: 'root'
})
export class CoreService {

    constructor(
        @Inject(KuiConfigToken) public kuiConfig: KuiConfig,
    ) { }

    getKnoraApiURL(): string {
        return (this.kuiConfig.knora.apiProtocol + '://' + this.kuiConfig.knora.apiHost) +
            (this.kuiConfig.knora.apiPort !== null ? ':' + this.kuiConfig.knora.apiPort : '') +
            (this.kuiConfig.knora.apiPath ? '/' + this.kuiConfig.knora.apiPath : '');
    }
}

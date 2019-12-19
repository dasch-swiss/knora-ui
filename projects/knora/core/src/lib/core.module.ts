import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { KnoraApiConfig, KnoraApiConnection } from '@knora/api';

import { KuiConfig } from './core.config';

// config for knora-api-js-lib (@knora/api)
export const KnoraApiConfigToken = new InjectionToken<KnoraApiConfig>('Knora api configuration');

// connection config for knora-api-js-lib (@knora/api)
export const KnoraApiConnectionToken = new InjectionToken<KnoraApiConnection>('Knora api connection configuration');

// config for knora-ui (@knora/action, @knora/search, @knora/viewer)
export const KuiConfigToken = new InjectionToken<KuiConfig>('Main configuration for knora-ui modules');

@NgModule({
    imports: [],
    declarations: [],
    exports: []
})
export class KuiCoreModule {

    static forRoot(kuiConfig: KuiConfig): ModuleWithProviders {
        // get the app environment configuration here
        // console.log('KuiCoreModule - forRoot - config: ', config);
        return {
            ngModule: KuiCoreModule,
            providers: [
                { provide: KuiConfigToken, useValue: kuiConfig }
            ]
        };
    }
}

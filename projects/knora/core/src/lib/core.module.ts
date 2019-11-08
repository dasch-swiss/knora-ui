import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { KnoraApiConnection } from '@knora/api';

import { KuiConfig } from './core.config';

export const KnoraApiConnectionToken = new InjectionToken<KnoraApiConnection>('Knora api connection configuration');

export const KuiConfigToken = new InjectionToken<KuiConfig>('Main configuration for knora-ui modules');

@NgModule({
    imports: [],
    declarations: [],
    exports: []
})
export class KuiCoreModule {

    static forRoot(config: KuiConfig): ModuleWithProviders {
        // get the app environment configuration here
        // console.log('KuiCoreModule - forRoot - config: ', config);
        return {
            ngModule: KuiCoreModule,
            providers: [
                { provide: KuiConfigToken, useValue: config }
            ]
        };
    }
}

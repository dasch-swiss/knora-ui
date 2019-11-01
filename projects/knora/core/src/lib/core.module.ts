import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { KnoraApiConnection } from '@knora/api';

import { KnoraUiConfig } from './core.config';

export const KnoraApiConnectionToken = new InjectionToken<KnoraApiConnection>('Knora api connection configuration');

export const KnoraUiConfigToken = new InjectionToken<KnoraUiConfig>('Main configuration for knora-ui modules');

/** @deprecated use KnoraUiConfigToken instead
 *
 */
export const KuiCoreConfigToken = new InjectionToken<KnoraUiConfig>('Main configuration for knora-ui modules');

@NgModule({
    imports: [],
    declarations: [],
    exports: []
})
export class KuiCoreModule {

    static forRoot(config: KnoraUiConfig): ModuleWithProviders {
        // get the app environment configuration here
        // console.log('KuiCoreModule - forRoot - config: ', config);
        return {
            ngModule: KuiCoreModule,
            providers: [
                { provide: KnoraUiConfigToken, useValue: config }
            ]
        };
    }
}

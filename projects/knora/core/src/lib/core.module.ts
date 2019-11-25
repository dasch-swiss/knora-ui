import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { KuiCoreConfig } from './declarations';

export const KuiCoreConfigToken = new InjectionToken<KuiCoreConfig>('KuiCoreConfigToken (knora.core.config)');

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    declarations: [],
    exports: [
        HttpClientModule
    ]
})
export class KuiCoreModule {
    /**
     *
     * @param {KuiCoreConfig} config
     * @returns {ModuleWithProviders}
     */
    static forRoot(config: KuiCoreConfig): ModuleWithProviders {
        // get the app environment configuration here
        return {
            ngModule: KuiCoreModule,
            providers: [
                { provide: KuiCoreConfigToken, useValue: config }
            ]
        };
    }
}

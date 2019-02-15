import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { KuiCoreConfig } from './declarations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

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
        console.log('KuiCoreModule - forRoot - config: ', config);
        return {
            ngModule: KuiCoreModule,
            providers: [
                {provide: KuiCoreConfigToken, useValue: config}
            ]
        };
    }
}

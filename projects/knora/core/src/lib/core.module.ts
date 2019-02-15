import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { KuiCoreConfig } from './declarations';

export const KuiCoreConfigToken = new InjectionToken<KuiCoreConfig>('KuiCoreConfigToken (knora.core.config)');


// Have to implement as we need to return a class from the provider, we should consider exporting
// this in the firebase/app types as this is our highest risk of breaks
export class KuiCore {}

export function _kuiCoreFactory(config: KuiCoreConfig) {
    console.log('KuiCoreModule - _kuiCoreFactory - config', config)
    return ( KuiCoreModule.initializeApp(config) );
}

const KuiCoreProvider = {
    provide: KuiCore,
    useFactory: _kuiCoreFactory,
    deps: [
        KuiCoreConfigToken
    ]
};

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    declarations: [],
    exports: [
        HttpClientModule
    ],
    providers: [ KuiCoreProvider ]
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

    static initializeApp(config: KuiCoreConfig): ModuleWithProviders {
        // get the app environment configuration here
        console.log('KuiCoreModule - initializeApp - config: ', config);
        return {
            ngModule: KuiCoreModule,
            providers: [
                {provide: KuiCoreConfigToken, useValue: config}
            ]
        };
    }
}

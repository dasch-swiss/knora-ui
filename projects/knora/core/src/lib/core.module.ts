import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
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
     * @param config
     */
    static forRoot(config: KuiCoreConfig): ModuleWithProviders {
        // get the app environment configuration here
        // console.log(config);
        return {
            ngModule: KuiCoreModule,
            providers: [
                {provide: KuiCoreConfigToken, useValue: config}
            ]
        };
    }

    static initializeApp(config: KuiCoreConfig) {
        return {
            ngModule: KuiCoreModule,
            providers: [
                {provide: KuiCoreConfigToken, useValue: config}
            ]
        };
    }


    /*
        static initializeApp(config: KuiCoreConfig): {
                ngModule: typeof KuiCoreModule,
                providers: {
                        provide: InjectionToken<string | KuiCoreConfig | undefined>;
                        useValue: string | KuiCoreConfig | undefined;
                    }[];
            };
        };
    */
}

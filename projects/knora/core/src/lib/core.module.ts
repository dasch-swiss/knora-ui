import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { KuiCoreConfig } from './declarations';

export const KUI_CORE_CONFIG_TOKEN = new InjectionToken<KuiCoreConfig>('KUI_CORE_CONFIG_TOKEN (knora.core.config)');

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
                {provide: KUI_CORE_CONFIG_TOKEN, useValue: config}
            ]
        };
    }

    static initializeApp(config: KuiCoreConfig) {
        return {
            ngModule: KuiCoreModule,
            providers: [
                {provide: KUI_CORE_CONFIG_TOKEN, useValue: config}
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

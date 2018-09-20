import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { KuiCoreConfig } from './declarations';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    declarations: [],
    exports: [
        HttpClientModule
    ],
    providers: [
        {provide: 'config', useValue: KuiCoreConfig}
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
                {provide: 'config', useValue: config}
            ]
        };
    }

    /**
     *
     * @param config
     */
    static initializeApp(config: KuiCoreConfig): ModuleWithProviders {
        console.log(config);
        return {
            ngModule: KuiCoreModule,
            providers: [
                {provide: 'config', useValue: config}
            ]
        };
    }

}

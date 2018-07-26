import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { KuiCoreConfig } from './declarations';
import { KeyPipe } from './declarations/api/pipes/key.pipe';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    declarations: [KeyPipe],
    exports: [
        HttpClientModule,
        KeyPipe
    ],
    providers: [
        {provide: 'config', useValue: KuiCoreConfig}
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
        // console.log(config);
        return {
            ngModule: KuiCoreModule,
            providers: [{provide: 'config', useValue: config}]
        };
    }
}

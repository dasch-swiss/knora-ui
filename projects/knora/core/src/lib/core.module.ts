import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { KuiCoreConfig } from './declarations';
import { KeyPipe } from './declarations/knora-api/pipes/key.pipe';
import { ReversePipe } from './declarations/knora-api/pipes/reverse.pipe';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    declarations: [
        KeyPipe,
        ReversePipe
    ],
    exports: [
        HttpClientModule,
        KeyPipe,
        ReversePipe
    ],
    providers: [
        { provide: 'config', useValue: KuiCoreConfig }
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
            providers: [{ provide: 'config', useValue: config }]
        };
    }
}

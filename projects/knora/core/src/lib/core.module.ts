import {ModuleWithProviders, NgModule} from '@angular/core';
import {KuiCoreConfig} from './declarations';

@NgModule({
    imports: [],
    declarations: [],
    exports: []
})


export class KuiCoreModule {
    static forRoot(config: KuiCoreConfig): ModuleWithProviders {
        // get the app environment configuration here
        // console.log(config);
        return {
            ngModule: KuiCoreModule,
            providers: [{provide: 'config', useValue: config}]
        };
    }
}

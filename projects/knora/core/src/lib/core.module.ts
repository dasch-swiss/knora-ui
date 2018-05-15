import {ModuleWithProviders, NgModule} from '@angular/core';
import {KnoraCoreConfig} from './declarations';

@NgModule({
    imports: [],
    declarations: [],
    exports: []
})


export class KnoraCoreModule {
    static forRoot(config: KnoraCoreConfig): ModuleWithProviders {
        // get the app environment configuration here
        // console.log(config);
        return {
            ngModule: KnoraCoreModule,
            providers: [{provide: 'config', useValue: config}]
        };
    }
}

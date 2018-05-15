import {ModuleWithProviders, NgModule} from '@angular/core';
import {KgCoreComponent} from './core.component';
import {KgCoreConfig} from './declarations';

@NgModule({
    imports: [],
    declarations: [
        KgCoreComponent
    ],
    exports: [
        KgCoreComponent
    ]
})

export class KgCoreModule {
    static forRoot(config: KgCoreConfig): ModuleWithProviders {
        // User config get logged here
        console.log(config);
        return {
            ngModule: KgCoreModule,
            providers: [{provide: 'config', useValue: config}]
        };
    }
}

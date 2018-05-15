import {ModuleWithProviders, NgModule} from '@angular/core';
import {CoreComponent} from './core.component';
import {ApiService} from './services/api.service';
import {CoreConfig} from './declarations';

@NgModule({
  imports: [],
  declarations: [
    CoreComponent
  ],
  exports: [
    CoreComponent
  ]
})

export class CoreModule {
  static forRoot(config: CoreConfig): ModuleWithProviders {
    // User config get logged here
    console.log(config);
    return {
      ngModule: CoreModule,
      providers: [ApiService, {provide: 'config', useValue: config}]
    };
  }
}

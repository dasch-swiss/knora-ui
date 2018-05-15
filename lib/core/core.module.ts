import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiService, KnoraCoreConfig} from '@knora/core';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class KnoraCoreModule {

  static forRoot(config: KnoraCoreConfig): ModuleWithProviders {
    // User config get logged here
    console.log(config);
    return {
      ngModule: KnoraCoreModule,
      providers: [ApiService, {provide: 'config', useValue: config}]
    };
  }
}

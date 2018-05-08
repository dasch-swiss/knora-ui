import {NgModule} from '@angular/core';

import {KnoraCoreModule} from '@knora/core';
import {KnoraProgressIndicatorModule} from '@knora/progress-indicator';

@NgModule({
  imports: [
    KnoraCoreModule,
    KnoraProgressIndicatorModule
  ],

  exports: [
    KnoraCoreModule,
    KnoraProgressIndicatorModule
  ]
})
export class KnoraGuiModule {
}

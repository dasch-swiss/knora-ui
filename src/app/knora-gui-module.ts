import {NgModule} from '@angular/core';

import {KnoraProgressIndicatorModule} from '@knora/progress-indicator';

@NgModule({
  imports: [
    KnoraProgressIndicatorModule
  ],

  exports: [
    KnoraProgressIndicatorModule
  ]
})
export class KnoraGuiModule {
}

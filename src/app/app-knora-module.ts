import {NgModule} from '@angular/core';

import {KnoraProgressIndicatorModule} from '@knora/progress-indicator';

// import {CdkTableModule} from '@angular/cdk';

@NgModule({
  imports: [
    KnoraProgressIndicatorModule
  ],

  exports: [
    KnoraProgressIndicatorModule
  ]
})
export class AppKnoraModule {
}

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {HeaderComponent} from './framework/header/header.component';
import {StartComponent} from './framework/start/start.component';
import {AppMaterialModule} from './app-material-module';
import {ProgressIndicatorDemoComponent} from './demo/progress-indicator-demo/progress-indicator-demo.component';

// knora gui modules
import {KnoraProgressIndicatorModule} from '@knora/progress-indicator';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    StartComponent,
    ProgressIndicatorDemoComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    AppMaterialModule,
    KnoraProgressIndicatorModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

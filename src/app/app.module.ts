import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AppRoutingModule} from './app-routing.module';
// import all needed modules from material
import {AppMaterialModule} from './app-material-module';

// import all knora gui modules, which are installed by yarn and the app package.json
import {AppKnoraModule} from './app-knora-module';

import {AppComponent} from './app.component';
// general components
import {HeaderComponent} from './framework/header/header.component';

// all main components from the demo app
import {LandingPageComponent} from './landing-page/landing-page.component';

import {ModulesIndexComponent} from './examples/modules-index/modules-index.component';
import {StartComponent} from './examples/start/start.component';

// all demo components; one for each knora module
import {ProgressIndicatorDemoComponent} from './examples/modules-demo/progress-indicator-demo/progress-indicator-demo.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LandingPageComponent,
    ModulesIndexComponent,
    StartComponent,
    ProgressIndicatorDemoComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    AppMaterialModule,
    AppKnoraModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

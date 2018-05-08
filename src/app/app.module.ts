import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing-module';

import {AppComponent} from './app.component';
import {KnoraGuiModule} from './knora-gui-module';
import {MaterialModule} from './material-module';
// landing page framework components
import {MainHeaderComponent} from './landing-page/partials/main-header/main-header.component';
import {ModuleHeaderComponent} from './landing-page/partials/module-header/module-header.component';
import {ModuleIndexComponent} from './landing-page/partials/module-index/module-index.component';
import {IntroductionComponent} from './landing-page/introduction/introduction.component';
import {DemoIntroComponent} from './landing-page/demo-intro/demo-intro.component';
// examples: demo components
import {ProgressIndicatorDemoComponent} from './knora-gui-examples/progress-indicator-demo/progress-indicator-demo.component';


@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    ModuleHeaderComponent,
    IntroductionComponent,
    ProgressIndicatorDemoComponent,
    DemoIntroComponent,
    ModuleIndexComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    KnoraGuiModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

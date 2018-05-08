import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing-module';

import {AppComponent} from './app.component';
import {MaterialModule} from './material-module';
// landing page framework components
import {MainHeaderComponent} from './landing-page/partials/main-header/main-header.component';
import {ModuleHeaderComponent} from './landing-page/partials/module-header/module-header.component';
import {ModuleIndexComponent} from './landing-page/partials/module-index/module-index.component';
import {IntroductionComponent} from './landing-page/introduction/introduction.component';
import {DemoIntroComponent} from './landing-page/demo-intro/demo-intro.component';
// examples: demo components
import {ProgressIndicatorDemoComponent} from './knora-gui-examples/progress-indicator-demo/progress-indicator-demo.component';
import { CoreDemoComponent } from './knora-gui-examples/core-demo/core-demo.component';
import {ApiService, KnoraCoreModule, ProjectsService} from '@knora/core';
import {KnoraProgressIndicatorModule} from '@knora/progress-indicator';


@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    ModuleHeaderComponent,
    IntroductionComponent,
    ProgressIndicatorDemoComponent,
    DemoIntroComponent,
    ModuleIndexComponent,
    CoreDemoComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    KnoraCoreModule,
    KnoraProgressIndicatorModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [ApiService, ProjectsService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

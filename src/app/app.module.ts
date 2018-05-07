import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing-module';

import {AppComponent} from './app.component';
import {KnoraGuiModule} from './knora-gui-module';
import {MaterialModule} from './material-module';
// landing page framework components
import {ModuleHeaderComponent} from './landing-page/framework/module-header/module-header.component';
import {MainHeaderComponent} from './landing-page/framework/main-header/main-header.component';
import {ModuleSidenavComponent} from './landing-page/framework/module-sidenav/module-sidenav.component';
import {MainIndexComponent} from './landing-page/main-index/main-index.component';
import {DemoIndexComponent} from './landing-page/demo-index/demo-index.component';
import {DemoIntroComponent} from './landing-page/demo-intro/demo-intro.component';
// examples: demo components
import {ProgressIndicatorDemoComponent} from './knora-gui-examples/progress-indicator-demo/progress-indicator-demo.component';



@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    ModuleHeaderComponent,
    ModuleSidenavComponent,
    MainIndexComponent,
    ProgressIndicatorDemoComponent,
    DemoIndexComponent,
    DemoIntroComponent
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

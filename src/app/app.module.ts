import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing-module';

import {AppComponent} from './app.component';
import {MaterialModule} from './material-module';


// import the knora-ui modules
import {KuiCoreConfig, KuiCoreModule} from '@knora/core';
import {KuiProgressIndicatorModule} from '@knora/progress-indicator';

// set up the environment configuration
import {environment} from '../environments/environment';

const AppEnvironment: KuiCoreConfig = {
    api: environment.api,
    media: environment.media,
    gui: environment.gui
};



// landing page framework components
import {MainHeaderComponent} from './landing-page/partials/main-header/main-header.component';
import {ModuleHeaderComponent} from './landing-page/partials/module-header/module-header.component';
import {ModuleIndexComponent} from './landing-page/partials/module-index/module-index.component';
import {IntroductionComponent} from './landing-page/introduction/introduction.component';
import {DemoIntroComponent} from './landing-page/demo-intro/demo-intro.component';

// examples: demo components
import {ProgressIndicatorDemoComponent} from './knora-ui-examples/progress-indicator-demo/progress-indicator-demo.component';
import {CoreDemoComponent} from './knora-ui-examples/core-demo/core-demo.component';
import { ProjectsComponent } from './knora-ui-examples/core-demo/projects/projects.component';



@NgModule({
    declarations: [
        AppComponent,
        MainHeaderComponent,
        ModuleHeaderComponent,
        IntroductionComponent,
        ProgressIndicatorDemoComponent,
        DemoIntroComponent,
        ModuleIndexComponent,
        CoreDemoComponent,
        ProjectsComponent
    ],
    imports: [
        BrowserModule,
        RouterModule,
        AppRoutingModule,
        KuiCoreModule.forRoot(AppEnvironment),
        KuiProgressIndicatorModule,
        MaterialModule,
        HttpClientModule
    ],
    providers: [
//    CoreService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

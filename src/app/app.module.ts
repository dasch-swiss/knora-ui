import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing-module';

import {ShowdownModule} from 'ngx-showdown';

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
    app: environment.app
};


// landing page framework components
import {MainHeaderComponent} from './partials/main-header/main-header.component';
import {ModuleHeaderComponent} from './partials/module-header/module-header.component';
import {ModuleIndexComponent} from './partials/module-index/module-index.component';
import {MainIntroComponent} from './landing-page/main-intro/main-intro.component';
import {DemoIntroComponent} from './landing-page/demo-intro/demo-intro.component';

// examples: demo components
import {ProgressIndicatorDemoComponent} from './knora-ui-examples/progress-indicator-demo/progress-indicator-demo.component';
import {CoreDemoComponent} from './knora-ui-examples/core-demo/core-demo.component';
import {ProjectsComponent} from './knora-ui-examples/core-demo/projects/projects.component';
import {UsersComponent} from './knora-ui-examples/core-demo/users/users.component';
import {AuthenticationComponent} from './knora-ui-examples/core-demo/authentication/authentication.component';
import {ExampleViewerComponent} from './partials/example-viewer/example-viewer.component';
import {SanitizeHtmlPipe} from './partials/pipes/sanitize-html.pipe';


@NgModule({
    declarations: [
        AppComponent,
        MainHeaderComponent,
        ModuleHeaderComponent,
        MainIntroComponent,
        ProgressIndicatorDemoComponent,
        DemoIntroComponent,
        ModuleIndexComponent,
        CoreDemoComponent,
        ProjectsComponent,
        UsersComponent,
        AuthenticationComponent,
        ExampleViewerComponent,
        SanitizeHtmlPipe
    ],
    imports: [
        BrowserModule,
        RouterModule,
        AppRoutingModule,
        KuiCoreModule.forRoot(AppEnvironment),
        KuiProgressIndicatorModule,
        MaterialModule,
        HttpClientModule,
        ShowdownModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}

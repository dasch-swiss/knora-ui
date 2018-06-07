import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing-module';


import {MarkdownModule} from 'ngx-markdown';

import {AppComponent} from './app.component';
import {MaterialModule} from './material-module';


// import the knora-ui modules
import {KuiCoreConfig, KuiCoreModule} from '@knora/core';
import {KuiLoginModule} from '@knora/login';
import {KuiProgressIndicatorModule} from '@knora/progress-indicator';
import {KuiProjectModule} from '@knora/project';

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
import {LoginComponent} from './knora-ui-examples/login/login.component';
import {ProjectComponent} from './knora-ui-examples/project/project.component';



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
        SanitizeHtmlPipe,
        LoginComponent,
        ProjectComponent
    ],
    imports: [
        BrowserModule,
        RouterModule,
        AppRoutingModule,
        KuiCoreModule.forRoot(AppEnvironment),
        KuiProgressIndicatorModule,
        KuiLoginModule,
        KuiProjectModule,
        MaterialModule,
        HttpClientModule,
        MarkdownModule.forRoot({ loader: HttpClient })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}

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
import {KuiAuthenticationModule} from '@knora/authentication';
import {KuiAdminModule} from '@knora/admin';
import {KuiActionModule} from '@knora/action';
import {KuiSearchModule} from '@knora/search';
import {KuiViewerModule} from '@knora/viewer';
// set up the environment configuration
import {environment} from '../environments/environment';
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
import {ExampleViewerComponent} from './partials/example-viewer/example-viewer.component';
import {SanitizeHtmlPipe} from './partials/pipes/sanitize-html.pipe';
import {GroupsComponent} from './knora-ui-examples/core-demo/groups/groups.component';
import {ListsComponent} from './knora-ui-examples/core-demo/lists/lists.component';
import {TreeComponent} from './material/tree/tree.component';
import {ResourceComponent} from './knora-ui-examples/core-demo/resource/resource.component';
import {LoginComponent} from './knora-ui-examples/login/login.component';
import {ProjectComponent} from './knora-ui-examples/project/project.component';

const AppEnvironment: KuiCoreConfig = {
    api: environment.api,
    media: environment.media,
    app: environment.app
};


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
        ExampleViewerComponent,
        SanitizeHtmlPipe,
        GroupsComponent,
        ListsComponent,
        TreeComponent,
        ResourceComponent,
        LoginComponent,
        ProjectComponent
    ],
    imports: [
        BrowserModule,
        RouterModule,
        AppRoutingModule,
        KuiCoreModule.forRoot(AppEnvironment),
        KuiAuthenticationModule,
        KuiAdminModule,
        KuiActionModule,
        KuiSearchModule,
        KuiViewerModule,
        MaterialModule,
        HttpClientModule,
        MarkdownModule.forRoot({loader: HttpClient})
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing-module';


import { MarkdownModule } from 'ngx-markdown';

import { AppComponent } from './app.component';
import { MaterialModule } from './material-module';
// import the knora-ui modules
import { KuiCoreModule } from '@knora/core';
import { KuiAuthenticationModule, LoginFormComponent } from '@knora/authentication';
import { KuiAdminModule } from '@knora/admin';
import { KuiActionModule } from '@knora/action';
import { KuiSearchModule } from '@knora/search';
import { KuiViewerModule } from '@knora/viewer';
// set up the environment configuration
import { environment } from '../environments/environment';
// landing page framework components
import { MainHeaderComponent } from './partials/main-header/main-header.component';
import { ModuleHeaderComponent } from './partials/module-header/module-header.component';
import { ModuleIndexComponent } from './partials/module-index/module-index.component';
import { MainIntroComponent } from './landing-page/main-intro/main-intro.component';
import { DemoIntroComponent } from './landing-page/demo-intro/demo-intro.component';
// examples: demo components
import { ProgressIndicatorComponent } from './knora-ui-examples/action-demo/progress-indicator/progress-indicator.component';
import { CoreDemoComponent } from './knora-ui-examples/core-demo/core-demo.component';
import { ProjectsComponent } from './knora-ui-examples/core-demo/projects/projects.component';
import { UsersComponent } from './knora-ui-examples/core-demo/users/users.component';
import { ExampleViewerComponent } from './partials/example-viewer/example-viewer.component';
import { SanitizeHtmlPipe } from './partials/pipes/sanitize-html.pipe';
import { GroupsComponent } from './knora-ui-examples/core-demo/groups/groups.component';
import { ListsComponent } from './knora-ui-examples/core-demo/lists/lists.component';
import { TreeComponent } from './material/tree/tree.component';
import { ResourceComponent } from './knora-ui-examples/core-demo/resource/resource.component';
import { LoginComponent } from './knora-ui-examples/authentication-demo/login/login.component';
import { ProjectComponent } from './knora-ui-examples/project/project.component';
import { ActionDemoComponent } from './knora-ui-examples/action-demo/action-demo.component';
import { SortButtonComponent } from './knora-ui-examples/action-demo/sort-button/sort-button.component';
import { ModuleSubHeaderComponent } from './partials/module-sub-header/module-sub-header.component';
import { AdminImageComponent } from './knora-ui-examples/action-demo/admin-image/admin-image.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';

@NgModule({
    declarations: [
        AppComponent,
        MainHeaderComponent,
        ModuleHeaderComponent,
        MainIntroComponent,
        ProgressIndicatorComponent,
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
        ProjectComponent,
        ActionDemoComponent,
        SortButtonComponent,
        ModuleSubHeaderComponent,
        AdminImageComponent
    ],
    entryComponents: [
        // LoginFormComponent
    ],
    imports: [
        BrowserModule,
        RouterModule,
        AppRoutingModule,
        KuiCoreModule.forRoot({
            name: 'Knora-ui Demo App',
            api: environment.api,
            media: environment.media,
            app: environment.app,
        }),
        KuiAuthenticationModule,
        KuiAdminModule,
        KuiActionModule,
        KuiSearchModule,
        KuiViewerModule,
        MaterialModule,
        HttpClientModule,
        MarkdownModule.forRoot({loader: HttpClient})
    ],
    providers: [
        {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

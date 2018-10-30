import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

// import the knora-ui modules
import { KuiActionModule } from '@knora/action';
import { ErrorInterceptor, JwtInterceptor, KuiAuthenticationModule } from '@knora/authentication';
import { KuiCoreModule } from '@knora/core';
import { KuiSearchModule } from '@knora/search';
import { KuiViewerModule } from '@knora/viewer';

import { MarkdownModule } from 'ngx-markdown';
// set up the environment configuration
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';

import { AppRouting } from './app.routing';
import { ActionDemoComponent } from './knora-ui-examples/action-demo/action-demo.component';
import { AdminImageComponent } from './knora-ui-examples/action-demo/admin-image/admin-image.component';
// examples: demo components
import { ProgressIndicatorComponent } from './knora-ui-examples/action-demo/progress-indicator/progress-indicator.component';
import { SortButtonComponent } from './knora-ui-examples/action-demo/sort-button/sort-button.component';
import { AuthComponent } from './knora-ui-examples/authentication-demo/auth/auth.component';
import { LoginComponent } from './knora-ui-examples/authentication-demo/login/login.component';
import { CoreDemoComponent } from './knora-ui-examples/core-demo/core-demo.component';
import { GroupsComponent } from './knora-ui-examples/core-demo/groups/groups.component';
import { ListsComponent } from './knora-ui-examples/core-demo/lists/lists.component';
import { ProjectsComponent } from './knora-ui-examples/core-demo/projects/projects.component';
import { ResourceComponent } from './knora-ui-examples/core-demo/resource/resource.component';
import { UsersComponent } from './knora-ui-examples/core-demo/users/users.component';
import { SearchDemoComponent } from './knora-ui-examples/search-demo/search-demo.component';
import { SearchResultComponent } from './knora-ui-examples/search-demo/search-result/search-result.component';
import { PropertiesComponent } from './knora-ui-examples/viewer-demo/properties/properties.component';
import { ViewerDemoComponent } from './knora-ui-examples/viewer-demo/viewer-demo.component';
import { ViewsComponent } from './knora-ui-examples/viewer-demo/views/views.component';
import { DemoIntroComponent } from './landing-page/demo-intro/demo-intro.component';
import { MainIntroComponent } from './landing-page/main-intro/main-intro.component';
import { MaterialModule } from './material-module';
import { TreeComponent } from './material/tree/tree.component';
import { ExampleViewerComponent } from './partials/example-viewer/example-viewer.component';
import { ResourcesComponent } from './knora-ui-examples/viewer-demo/resources/resources.component';
// landing page framework components
import { MainHeaderComponent } from './partials/main-header/main-header.component';
import { ModuleHeaderComponent } from './partials/module-header/module-header.component';
import { ModuleIndexComponent } from './partials/module-index/module-index.component';
import { ModuleSubHeaderComponent } from './partials/module-sub-header/module-sub-header.component';
import { SanitizeHtmlPipe } from './partials/pipes/sanitize-html.pipe';
import { ExistingNameComponent } from './knora-ui-examples/action-demo/existing-name/existing-name.component';
import { KeyComponent } from './knora-ui-examples/action-demo/key/key.component';
// dev documentation
import { DocIntroComponent } from './dev-docs/doc-intro/doc-intro.component';
import { SearchComponent } from './knora-ui-examples/core-demo/search/search.component';
import { GravsearchComponent } from './knora-ui-examples/core-demo/gravsearch/gravsearch.component';
import { IncomingComponent } from './knora-ui-examples/core-demo/incoming/incoming.component';
import { ConvertJsonLdComponent } from './knora-ui-examples/core-demo/convert-json-ld/convert-json-ld.component';
import { OntologyCacheComponent } from './knora-ui-examples/core-demo/ontology-cache/ontology-cache.component';
import { OntologyComponent } from './knora-ui-examples/core-demo/ontology/ontology.component';
import { ApiComponent } from './knora-ui-examples/core-demo/api/api.component';

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
        ActionDemoComponent,
        SortButtonComponent,
        ModuleSubHeaderComponent,
        AdminImageComponent,
        SearchDemoComponent,
        SearchResultComponent,
        ViewerDemoComponent,
        PropertiesComponent,
        ViewsComponent,
        AuthComponent,
        ExistingNameComponent,
        KeyComponent,
        ResourcesComponent,
        DocIntroComponent,
        SearchComponent,
        GravsearchComponent,
        IncomingComponent,
        ConvertJsonLdComponent,
        OntologyCacheComponent,
        OntologyComponent,
        ApiComponent
    ],
    entryComponents: [
        // LoginFormComponent
    ],
    imports: [
        BrowserModule,
        RouterModule,
        AppRouting,
        KuiCoreModule.forRoot({
            name: 'Knora-ui Demo App',
            api: environment.api,
            media: environment.media,
            app: environment.app,
        }),
        KuiAuthenticationModule,
        KuiActionModule,
        KuiSearchModule,
        KuiViewerModule,
        MaterialModule,
        HttpClientModule,
        MarkdownModule.forRoot({ loader: HttpClient }),
        ReactiveFormsModule
    ],
    providers: [
        {
            provide: MAT_DIALOG_DEFAULT_OPTIONS,
            useValue: {
                hasBackdrop: false
            }
        },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        // {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}

    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

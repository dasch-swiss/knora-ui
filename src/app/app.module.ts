import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
// import the knora-ui modules
import { KuiActionModule } from '@knora/action';
import { KnoraApiConnectionToken, KuiConfigToken, KuiCoreModule } from '@knora/core';
import { KuiSearchModule } from '@knora/search';
import { KuiViewerModule } from '@knora/viewer';
import { MarkdownModule } from 'ngx-markdown';

import { AppInitService } from './app-init.service';
import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
// dev documentation
import { DocIntroComponent } from './dev-docs/doc-intro/doc-intro.component';
import { ActionDemoComponent } from './knora-ui-examples/action-demo/action-demo.component';
import { AdminImageComponent } from './knora-ui-examples/action-demo/admin-image/admin-image.component';
import { ExistingNameComponent } from './knora-ui-examples/action-demo/existing-name/existing-name.component';
import { KeyComponent } from './knora-ui-examples/action-demo/key/key.component';
import { LoginComponent } from './knora-ui-examples/action-demo/login/login.component';
import { MessageComponent } from './knora-ui-examples/action-demo/message/message.component';
// examples: demo components
import { ProgressIndicatorComponent } from './knora-ui-examples/action-demo/progress-indicator/progress-indicator.component';
import { SortButtonComponent } from './knora-ui-examples/action-demo/sort-button/sort-button.component';
import { StringifyStringLiteralComponent } from './knora-ui-examples/action-demo/stringify-string-literal/stringify-string-literal.component';
import { TruncateComponent } from './knora-ui-examples/action-demo/truncate/truncate.component';
import { CoreDemoComponent } from './knora-ui-examples/core-demo/core-demo.component';
import { ExtendedSearchComponent } from './knora-ui-examples/search-demo/extended-search/extended-search.component';
import { FulltextSearchComponent } from './knora-ui-examples/search-demo/fulltext-search/fulltext-search.component';
import { SearchDemoComponent } from './knora-ui-examples/search-demo/search-demo.component';
import { SearchPanelComponent } from './knora-ui-examples/search-demo/search-panel/search-panel.component';
import { PropertiesComponent } from './knora-ui-examples/viewer-demo/properties/properties.component';
import { ResourcesComponent } from './knora-ui-examples/viewer-demo/resources/resources.component';
import { SearchResultsComponent } from './knora-ui-examples/viewer-demo/search-results/search-results.component';
import { ViewerDemoComponent } from './knora-ui-examples/viewer-demo/viewer-demo.component';
import { ViewsComponent } from './knora-ui-examples/viewer-demo/views/views.component';
import { DemoIntroComponent } from './landing-page/demo-intro/demo-intro.component';
import { MainIntroComponent } from './landing-page/main-intro/main-intro.component';
import { MaterialModule } from './material-module';
import { TreeComponent } from './material/tree/tree.component';
import { DocumentationViewerComponent } from './partials/documentation-viewer/documentation-viewer.component';
import { ExampleViewerComponent } from './partials/example-viewer/example-viewer.component';
// landing page framework components
import { MainHeaderComponent } from './partials/main-header/main-header.component';
import { ModuleHeaderComponent } from './partials/module-header/module-header.component';
import { ModuleIndexComponent } from './partials/module-index/module-index.component';
import { SanitizeHtmlPipe } from './partials/pipes/sanitize-html.pipe';
import { SanitizeUrlPipe } from './partials/pipes/sanitize-url.pipe';
import { TrimBracketsPipe } from './partials/pipes/trim-brackets.pipe';

export function initializeApp(appInitService: AppInitService) {
    return (): Promise<any> => {
        return appInitService.Init();
    };
}


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
        ExampleViewerComponent,
        SanitizeHtmlPipe,
        SanitizeUrlPipe,
        TreeComponent,
        LoginComponent,
        ActionDemoComponent,
        SortButtonComponent,
        AdminImageComponent,
        SearchDemoComponent,
        ViewerDemoComponent,
        PropertiesComponent,
        ViewsComponent,
        ExistingNameComponent,
        KeyComponent,
        ResourcesComponent,
        DocIntroComponent,
        DocumentationViewerComponent,
        SearchPanelComponent,
        TrimBracketsPipe,
        FulltextSearchComponent,
        ExtendedSearchComponent,
        MessageComponent,
        SearchResultsComponent,
        TruncateComponent,
        StringifyStringLiteralComponent
    ],
    entryComponents: [
        // LoginFormComponent
    ],
    imports: [
        BrowserModule,
        RouterModule,
        AppRouting,
        FlexLayoutModule,
        KuiCoreModule,
        KuiActionModule,
        KuiSearchModule,
        KuiViewerModule,
        MaterialModule,
        HttpClientModule,
        MarkdownModule.forRoot({ loader: HttpClient }),
        ReactiveFormsModule
    ],
    providers: [
        AppInitService,
        {
            provide: APP_INITIALIZER, useFactory: initializeApp, deps: [AppInitService], multi: true
        },
        {
            provide: KuiConfigToken, useFactory: () => AppInitService.kuiConfig
        },
        {
            provide: KnoraApiConnectionToken, useFactory: () => AppInitService.knoraApiConnection
        },
        {
            provide: MAT_DIALOG_DEFAULT_OPTIONS,
            useValue: {
                hasBackdrop: false
            }
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }



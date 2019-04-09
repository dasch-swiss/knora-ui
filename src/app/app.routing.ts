import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResourceViewComponent, SearchResultsComponent } from '@knora/viewer';
import { AppDemo } from './app.config';
// dev docs
import { DocIntroComponent } from './dev-docs/doc-intro/doc-intro.component';

import { ActionDemoComponent } from './knora-ui-examples/action-demo/action-demo.component';
import { AdminImageComponent } from './knora-ui-examples/action-demo/admin-image/admin-image.component';
import { ExistingNameComponent } from './knora-ui-examples/action-demo/existing-name/existing-name.component';
import { KeyComponent } from './knora-ui-examples/action-demo/key/key.component';
import { MessageComponent } from './knora-ui-examples/action-demo/message/message.component';
import { ProgressIndicatorComponent } from './knora-ui-examples/action-demo/progress-indicator/progress-indicator.component';
import { SortButtonComponent } from './knora-ui-examples/action-demo/sort-button/sort-button.component';
import { AuthComponent } from './knora-ui-examples/authentication-demo/auth/auth.component';
import { AuthenticationDemoComponent } from './knora-ui-examples/authentication-demo/authentication-demo.component';

import { LoginComponent } from './knora-ui-examples/authentication-demo/login/login.component';
import { ConvertJsonLdComponent } from './knora-ui-examples/core-demo/convert-json-ld/convert-json-ld.component';
import { CoreDemoComponent } from './knora-ui-examples/core-demo/core-demo.component';
import { GravsearchComponent } from './knora-ui-examples/core-demo/gravsearch/gravsearch.component';
import { GroupsComponent } from './knora-ui-examples/core-demo/groups/groups.component';
import { IncomingComponent } from './knora-ui-examples/core-demo/incoming/incoming.component';
import { ListsComponent } from './knora-ui-examples/core-demo/lists/lists.component';
import { OntologyCacheComponent } from './knora-ui-examples/core-demo/ontology-cache/ontology-cache.component';
import { OntologyComponent } from './knora-ui-examples/core-demo/ontology/ontology.component';
import { ProjectsComponent } from './knora-ui-examples/core-demo/projects/projects.component';
import { ResourceComponent } from './knora-ui-examples/core-demo/resource/resource.component';
import { SearchComponent } from './knora-ui-examples/core-demo/search/search.component';
import { UsersComponent } from './knora-ui-examples/core-demo/users/users.component';

import { SearchDemoComponent } from './knora-ui-examples/search-demo/search-demo.component';
import { SearchPanelComponent } from './knora-ui-examples/search-demo/search-panel/search-panel.component';
import { ExtendedSearchComponent } from './knora-ui-examples/search-demo/extended-search/extended-search.component';
import { FulltextSearchComponent } from './knora-ui-examples/search-demo/fulltext-search/fulltext-search.component';

import { PropertiesComponent } from './knora-ui-examples/viewer-demo/properties/properties.component';
import { ResourcesComponent } from './knora-ui-examples/viewer-demo/resources/resources.component';

import { ViewerDemoComponent } from './knora-ui-examples/viewer-demo/viewer-demo.component';
import { ViewsComponent } from './knora-ui-examples/viewer-demo/views/views.component';
import { DemoIntroComponent } from './landing-page/demo-intro/demo-intro.component';
// / start with main-intro
import { MainIntroComponent } from './landing-page/main-intro/main-intro.component';
import { TreeComponent } from './material/tree/tree.component';
// /modules demo
import { ModuleIndexComponent } from './partials/module-index/module-index.component';

const appRoutes: Routes = [
    {
        path: '',
        component: MainIntroComponent,
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'modules',
        component: ModuleIndexComponent,

        children: [
            {
                path: '',
                component: DemoIntroComponent,
                data: { module: 'demo' }
            },
            {
                path: 'action',
                component: ActionDemoComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'readme',
                        pathMatch: 'full'
                    },
                    {
                        path: 'readme',
                        component: DemoIntroComponent,
                        data: { module: 'action' }
                    },
                    {
                        path: 'sort-button',
                        component: SortButtonComponent
                    },
                    {
                        path: 'message',
                        component: MessageComponent
                    },
                    {
                        path: 'progress-indicator',
                        component: ProgressIndicatorComponent
                    },
                    {
                        path: 'admin-image',
                        component: AdminImageComponent
                    },
                    {
                        path: 'existing-name',
                        component: ExistingNameComponent
                    },
                    {
                        path: 'key',
                        component: KeyComponent
                    }
                ]
            },
            {
                path: 'authentication',
                component: AuthenticationDemoComponent,
                // canActivate: [AuthGuard],
                children: [
                    {
                        path: '',
                        redirectTo: 'readme',
                        pathMatch: 'full'
                    },
                    {
                        path: 'readme',
                        component: DemoIntroComponent,
                        data: { module: 'authentication' }
                    },
                    {
                        path: 'login-form',
                        component: LoginComponent
                    },
                    {
                        path: 'authentication',
                        component: AuthComponent
                    },
                ]
            },
            {
                path: 'search',
                component: SearchDemoComponent,
                data: { partOf: AppDemo.searchModule },
                children: [
                    {
                        path: '',
                        redirectTo: 'readme',
                        pathMatch: 'full'
                    },
                    {
                        path: 'readme',
                        component: DemoIntroComponent,
                        data: { module: 'search' }
                    },
                    {
                        path: 'search-panel',
                        component: SearchPanelComponent
                    },
                    {
                        path: 'fulltext-search',
                        component: FulltextSearchComponent
                    },
                    {
                        path: 'extended-search',
                        component: ExtendedSearchComponent
                    },
                ]
            },
            {
                path: 'viewer',
                component: ViewerDemoComponent,
                data: { module: AppDemo.viewerModule },
                children: [
                    {
                        path: '',
                        redirectTo: 'readme',
                        pathMatch: 'full'
                    },
                    {
                        path: 'readme',
                        component: DemoIntroComponent,
                        data: { module: 'viewer' }
                    },
                    {
                        path: 'resources',
                        component: ResourcesComponent,
                        data: { partOf: AppDemo.viewerModule }
                    },
                    {
                        path: 'resource/:id',
                        component: ResourceViewComponent
                    },
                    {
                        path: 'properties',
                        component: PropertiesComponent,
                        data: { partOf: AppDemo.viewerModule }
                    },
                    {
                        path: 'views',
                        component: ViewsComponent,
                        data: { partOf: AppDemo.viewerModule }
                    }

                ]
            },
            {
                path: 'core',
                component: CoreDemoComponent,

                children: [
                    {
                        path: '',
                        redirectTo: 'readme',
                        pathMatch: 'full'
                    },
                    {
                        path: 'readme',
                        component: DemoIntroComponent,
                        data: { module: 'core' }
                    },
                    {
                        path: 'projects',
                        component: ProjectsComponent
                    },
                    {
                        path: 'users',
                        component: UsersComponent
                    },
                    {
                        path: 'groups',
                        component: GroupsComponent
                    },
                    {
                        path: 'lists',
                        component: ListsComponent
                    },
                    {
                        path: 'resource',
                        component: ResourceComponent
                    },
                    {
                        path: 'search',
                        component: SearchComponent
                    },
                    {
                        path: 'ontology-cache',
                        component: OntologyCacheComponent
                    },
                    {
                        path: 'ontology',
                        component: OntologyComponent
                    },
                    {
                        path: 'incoming',
                        component: IncomingComponent
                    },
                    {
                        path: 'grav-search',
                        component: GravsearchComponent
                    },
                    {
                        path: 'convert-jsonld',
                        component: ConvertJsonLdComponent
                    }

                ]
            }
        ]
    },
    {
        path: 'documentation',
        component: DocIntroComponent
    },
    {
        path: 'test',
        component: TreeComponent
    }
    /*
        {
            path: '**',
            component: MessageComponent,
            data: {status: 404}
        }
        */
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRouting {
}

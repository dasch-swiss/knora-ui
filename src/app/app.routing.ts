import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@knora/authentication';
import { ResourceViewComponent } from '@knora/viewer';
import { AppDemo } from './app.config';
import { ActionDemoComponent } from './knora-ui-examples/action-demo/action-demo.component';
import { AdminImageComponent } from './knora-ui-examples/action-demo/admin-image/admin-image.component';
import { ExistingNameComponent } from './knora-ui-examples/action-demo/existing-name/existing-name.component';
import { KeyComponent } from './knora-ui-examples/action-demo/key/key.component';
import { AuthenticationDemoComponent } from './knora-ui-examples/authentication-demo/authentication-demo.component';
import { SearchPanelComponent } from './knora-ui-examples/search-demo/search-panel/search-panel.component';

// / start with main-intro
import { MainIntroComponent } from './landing-page/main-intro/main-intro.component';
// dev docs
import { DocIntroComponent } from './dev-docs/doc-intro/doc-intro.component';
// /modules demo
import { ModuleIndexComponent } from './partials/module-index/module-index.component';
import { DemoIntroComponent } from './landing-page/demo-intro/demo-intro.component';

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
import { SearchComponent } from './knora-ui-examples/core-demo/search/search.component';
import { OntologyCacheComponent } from './knora-ui-examples/core-demo/ontology-cache/ontology-cache.component';
import { OntologyComponent } from './knora-ui-examples/core-demo/ontology/ontology.component';
import { IncomingComponent } from './knora-ui-examples/core-demo/incoming/incoming.component';
import { GravsearchComponent } from './knora-ui-examples/core-demo/gravsearch/gravsearch.component';
import { ConvertJsonLdComponent } from './knora-ui-examples/core-demo/convert-json-ld/convert-json-ld.component';

import { SearchDemoComponent } from './knora-ui-examples/search-demo/search-demo.component';
import { SearchResultComponent } from './knora-ui-examples/search-demo/search-result/search-result.component';
import { PropertiesComponent } from './knora-ui-examples/viewer-demo/properties/properties.component';
import { ResourcesComponent } from './knora-ui-examples/viewer-demo/resources/resources.component';

import { ViewerDemoComponent } from './knora-ui-examples/viewer-demo/viewer-demo.component';
import { ViewsComponent } from './knora-ui-examples/viewer-demo/views/views.component';
import { TreeComponent } from './material/tree/tree.component';

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
            },
            {
                path: 'action',
                component: ActionDemoComponent,
                children: [
                    {
                        path: 'sort-button',
                        component: SortButtonComponent
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
                canActivate: [AuthGuard],
                children: [
                    {
                        path: 'login-form',
                        component: LoginComponent
                    }
                ]
            },
            {
                path: 'search',
                component: SearchDemoComponent,
                data: { partOf: AppDemo.searchModule },
                children: [
                    {
                        path: 'search',
                        component: SearchPanelComponent,
                        children: [
                            {
                                path: ':mode/:q',
                                component: SearchResultComponent
                            }
                        ]
                    }
                ]
            },
            {
                path: 'viewer',
                component: ViewerDemoComponent,
                data: { module: AppDemo.viewerModule },
                children: [
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

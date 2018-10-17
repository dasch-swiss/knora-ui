import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '@knora/authentication';
import { AppDemo } from './app.config';
import { ExistingNameComponent } from './knora-ui-examples/action-demo/existing-name/existing-name.component';
import { KeyComponent } from './knora-ui-examples/action-demo/key/key.component';
// / start with main-intro
import { MainIntroComponent } from './landing-page/main-intro/main-intro.component';
// dev docs
import { DocIntroComponent } from './dev-docs/doc-intro/doc-intro.component';
// /modules demo
import { ModuleIndexComponent } from './partials/module-index/module-index.component';
import { DemoIntroComponent } from './landing-page/demo-intro/demo-intro.component';
import { ProgressIndicatorComponent } from './knora-ui-examples/action-demo/progress-indicator/progress-indicator.component';
import { CoreDemoComponent } from './knora-ui-examples/core-demo/core-demo.component';
import { ProjectsComponent } from './knora-ui-examples/core-demo/projects/projects.component';
import { UsersComponent } from './knora-ui-examples/core-demo/users/users.component';
import { ListsComponent } from './knora-ui-examples/core-demo/lists/lists.component';
import { GroupsComponent } from './knora-ui-examples/core-demo/groups/groups.component';
import { TreeComponent } from './material/tree/tree.component';
import { ResourceComponent } from './knora-ui-examples/core-demo/resource/resource.component';

import { LoginComponent } from './knora-ui-examples/authentication-demo/login/login.component';
import { ActionDemoComponent } from './knora-ui-examples/action-demo/action-demo.component';
import { SortButtonComponent } from './knora-ui-examples/action-demo/sort-button/sort-button.component';
import { AdminImageComponent } from './knora-ui-examples/action-demo/admin-image/admin-image.component';

import { SearchDemoComponent } from './knora-ui-examples/search-demo/search-demo.component';
import { SearchResultComponent } from './knora-ui-examples/search-demo/search-result/search-result.component';

import { ViewerDemoComponent } from './knora-ui-examples/viewer-demo/viewer-demo.component';
import { PropertiesComponent } from './knora-ui-examples/viewer-demo/properties/properties.component';
import { ViewsComponent } from './knora-ui-examples/viewer-demo/views/views.component';
import { ObjectsComponent } from './knora-ui-examples/viewer-demo/objects/objects.component';
import { AuthComponent } from './knora-ui-examples/authentication-demo/auth/auth.component';

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
                component: AuthComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'search',
                component: SearchDemoComponent,
                data: { partOf: AppDemo.searchModule },

                children: [
                    {
                        path: ':mode/:q',
                        component: SearchResultComponent
                    }
                ]
            },
            {
                path: 'viewer',
                component: ViewerDemoComponent,
                data: { module: AppDemo.viewerModule },
                children: [
                    {
                        path: 'objects',
                        component: ObjectsComponent,
                        data: { partOf: AppDemo.viewerModule }
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

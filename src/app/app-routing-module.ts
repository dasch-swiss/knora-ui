import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
// / start with main-intro
import {MainIntroComponent} from './landing-page/main-intro/main-intro.component';
// /modules demo
import {ModuleIndexComponent} from './partials/module-index/module-index.component';
import {DemoIntroComponent} from './landing-page/demo-intro/demo-intro.component';
import {ExampleViewerComponent} from './partials/example-viewer/example-viewer.component';
// examples: demo components
import {ProgressIndicatorDemoComponent} from './knora-ui-examples/progress-indicator-demo/progress-indicator-demo.component';
import {CoreDemoComponent} from './knora-ui-examples/core-demo/core-demo.component';
import {ProjectsComponent} from './knora-ui-examples/core-demo/projects/projects.component';
import {UsersComponent} from './knora-ui-examples/core-demo/users/users.component';
import {ListsComponent} from './knora-ui-examples/core-demo/lists/lists.component';
import {GroupsComponent} from './knora-ui-examples/core-demo/groups/groups.component';
import {TreeComponent} from './material/tree/tree.component';


const appRoutes: Routes = [
    {
        path: '',
        component: MainIntroComponent,
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
                path: 'progress-indicator',
                component: ProgressIndicatorDemoComponent
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

                ]
            }
        ]
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

export class AppRoutingModule {
}

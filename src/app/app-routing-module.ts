import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
// / start with main-intro
import {MainIntroComponent} from './landing-page/main-intro/main-intro.component';
// /modules demo
import {ModuleIndexComponent} from './partials/module-index/module-index.component';
import {DemoIntroComponent} from './landing-page/demo-intro/demo-intro.component';
// examples: demo components
import {ProgressIndicatorDemoComponent} from './knora-ui-examples/progress-indicator-demo/progress-indicator-demo.component';
import {CoreDemoComponent} from './knora-ui-examples/core-demo/core-demo.component';
import {ProjectsComponent} from './knora-ui-examples/core-demo/projects/projects.component';
import {UsersComponent} from './knora-ui-examples/core-demo/users/users.component';
import {AuthenticationComponent} from './knora-ui-examples/core-demo/authentication/authentication.component';
import {ExampleViewerComponent} from './partials/example-viewer/example-viewer.component';
import {LoginComponent} from './knora-ui-examples/login/login.component';
import {ProjectComponent} from './knora-ui-examples/project/project.component';

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
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'project',
                component: ProjectComponent
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
                        path: 'authentication',
                        component: AuthenticationComponent
                    },
                    {
                        path: 'projects',
                        component: ProjectsComponent
                    },
                    {
                        path: 'users',
                        component: UsersComponent
                    }

                ]
            }
        ]
    },
    {
        path: 'test',
        component: ExampleViewerComponent
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

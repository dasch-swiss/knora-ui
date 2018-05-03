import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {StartComponent} from './framework/start/start.component';
// import {ActionDemoComponent} from './demo/action-demo/action-demo.component';
// import {AdminImageDemoComponent} from './demo/admin-image-demo/admin-image-demo.component';
import {ProgressIndicatorDemoComponent} from './demo/progress-indicator-demo/progress-indicator-demo.component';
// import {CoreDemoComponent} from './demo/core-demo/core-demo.component';


const appRoutes: Routes = [
    {
        path: '',
        component: StartComponent,
    },
    {
        path: 'progress-indicator',
        component: ProgressIndicatorDemoComponent
    }
    /*
    {
        path: 'admin-image',
        component: AdminImageDemoComponent
    },
    {
        path: 'action',
        component: ActionDemoComponent
    },
    {
        path: 'core',
        component: CoreDemoComponent
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

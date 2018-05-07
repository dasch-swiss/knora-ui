import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {LandingPageComponent} from './landing-page/landing-page.component';

import {ModulesIndexComponent} from './examples/modules-index/modules-index.component';
import {StartComponent} from './examples/start/start.component';

// examples: demo components
import {ProgressIndicatorDemoComponent} from './examples/modules-demo/progress-indicator-demo/progress-indicator-demo.component';


const appRoutes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'modules',
    component: ModulesIndexComponent,

    children: [
      {
        path: '',
        component: StartComponent,
      },
      {
        path: 'progress-indicator',
        component: ProgressIndicatorDemoComponent
      }
    ]
  },


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

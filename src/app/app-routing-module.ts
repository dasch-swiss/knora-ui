import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

// / start with landingpage
import {MainIndexComponent} from './landing-page/main-index/main-index.component';

// /modules demo
import {DemoIndexComponent} from './landing-page/demo-index/demo-index.component';
import {DemoIntroComponent} from './landing-page/demo-intro/demo-intro.component';

// examples: demo components
import {ProgressIndicatorDemoComponent} from './knora-gui-examples/progress-indicator-demo/progress-indicator-demo.component';



const appRoutes: Routes = [
  {
    path: '',
    component: MainIndexComponent,
  },
  {
    path: 'modules',
    component: DemoIndexComponent,

    children: [
      {
        path: '',
        component: DemoIntroComponent,
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

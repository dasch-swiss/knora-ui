import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

// / start with introduction
import {IntroductionComponent} from './landing-page/introduction/introduction.component';

// /modules demo
import {ModuleIndexComponent} from './landing-page/partials/module-index/module-index.component';
import {DemoIntroComponent} from './landing-page/demo-intro/demo-intro.component';

// examples: demo components
import {ProgressIndicatorDemoComponent} from './knora-gui-examples/progress-indicator-demo/progress-indicator-demo.component';
import {CoreDemoComponent} from './knora-gui-examples/core-demo/core-demo.component';




const appRoutes: Routes = [
  {
    path: '',
    component: IntroductionComponent,
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
        component: CoreDemoComponent
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

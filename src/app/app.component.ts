import {Component} from '@angular/core';
import {DemoModule} from './app.interfaces';
import {AppDemo} from './app.config';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  /*
  // set my server configuration first:
  config: SalsahCoreConfig = {
    api: environment.api,
    media: environment.media,
    gui: environment.gui
  };
  */

  examples: DemoModule[] = [
    AppDemo.progressIndicator
//    AppDemo.adminImage,
//    AppDemo.actionModule,
//    AppDemo.coreModule
  ];

}

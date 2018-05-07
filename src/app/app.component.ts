import {Component, OnInit} from '@angular/core';
import {DemoModule} from './app.interfaces';
import {AppDemo} from './app.config';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


  ngOnInit() {
    /*
    // set my server configuration first:
    config: SalsahCoreConfig = {
      api: environment.api,
      media: environment.media,
      gui: environment.gui
    };
    */

  }


}

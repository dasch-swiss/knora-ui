import {Component, OnInit} from '@angular/core';
import {CoreService, KnoraCoreConfig} from '@knora/core';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // set my server configuration first:
  config: KnoraCoreConfig = {
    api: environment.api,
    media: environment.media,
    gui: environment.gui
  };


  constructor(private _coreService: CoreService) {

  }

  ngOnInit() {
    // send the configuration to the core service
    this._coreService.addConfig(this.config);
  }

}


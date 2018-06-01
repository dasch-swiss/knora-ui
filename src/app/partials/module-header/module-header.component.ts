import {Component, Input, OnInit} from '@angular/core';
import {AppConfig} from '../../app.config';
import {DemoModule, Item} from '../../app.interfaces';


@Component({
  selector: 'app-module-header',
  templateUrl: './module-header.component.html',
  styleUrls: ['./module-header.component.scss']
})
export class ModuleHeaderComponent implements OnInit {

  @Input() demo: DemoModule = new DemoModule();

  stackBlitzDemo: string;
  package: string;
  badge: string;

  constructor() {
  }

  ngOnInit() {

    this.stackBlitzDemo = AppConfig.stackblitz + AppConfig.prefix + '-' + this.demo.name;

    if (this.demo.published) {

      const packageName: string = '@' + AppConfig.prefix + '/' + this.demo.name;

      const urlEncode = encodeURIComponent(packageName);

      this.package = AppConfig.npm + urlEncode;
      this.badge = AppConfig.badge + urlEncode + '.svg';
    }

  }

}

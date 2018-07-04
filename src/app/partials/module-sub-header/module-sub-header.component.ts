import { AppConfig } from './../../../../docs/app/app.config';
import { ActivatedRoute } from '@angular/router';
import { DemoModule } from './../../app.interfaces';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-module-sub-header',
  templateUrl: './module-sub-header.component.html',
  styleUrls: ['./module-sub-header.component.scss']
})
export class ModuleSubHeaderComponent implements OnInit {

  @Input() demo: DemoModule = new DemoModule();

  stackBlitzDemo: string;
  currentComponent: DemoModule;

  constructor(private _route: ActivatedRoute) { }

  ngOnInit() {

    // get child route to set a stackblitz link
    this._route.url.subscribe((url: any) => {

      this.currentComponent = this.findChild(url[0].path);

      if (this.currentComponent !== undefined && this.currentComponent.stackblitz === true) {
        this.stackBlitzDemo = AppConfig.stackblitz + AppConfig.prefix + '-' + this.currentComponent.name;
      }

    });
  }


  findChild(currentComp: string) {
    return this.demo.children.find((obj: any) => {
      return obj.name === currentComp;
    });
  }
}

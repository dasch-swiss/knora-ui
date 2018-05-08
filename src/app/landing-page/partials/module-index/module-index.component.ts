import { Component, OnInit } from '@angular/core';
import {DemoModule} from '../../../app.interfaces';
import {AppDemo} from '../../../app.config';

@Component({
  selector: 'app-module-index',
  templateUrl: './module-index.component.html',
  styleUrls: ['./module-index.component.scss']
})
export class ModuleIndexComponent implements OnInit {

  examples: DemoModule[] = [
    AppDemo.progressIndicator
//    AppDemo.adminImage,
//    AppDemo.actionModule,
//    AppDemo.coreModule
  ];

  constructor() { }

  ngOnInit() {
  }

}

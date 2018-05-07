import {Component, OnInit} from '@angular/core';
import {DemoModule} from '../../app.interfaces';
import {AppDemo} from '../../app.config';

@Component({
  selector: 'app-modules-index',
  templateUrl: './modules-index.component.html',
  styleUrls: ['./modules-index.component.scss']
})
export class ModulesIndexComponent implements OnInit {

  examples: DemoModule[] = [
    AppDemo.progressIndicator
//    AppDemo.adminImage,
//    AppDemo.actionModule,
//    AppDemo.coreModule
  ];


  constructor() {
  }

  ngOnInit() {
  }

}

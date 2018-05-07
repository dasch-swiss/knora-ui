import {Component, OnInit} from '@angular/core';
import {DemoModule} from '../../app.interfaces';
import {AppDemo} from '../../app.config';

@Component({
  selector: 'app-demo-index',
  templateUrl: './demo-index.component.html',
  styleUrls: ['./demo-index.component.scss']
})
export class DemoIndexComponent implements OnInit {

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

import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../app.demo';

@Component({
    selector: 'app-core-demo',
    templateUrl: './core-demo.component.html',
    styleUrls: ['./core-demo.component.scss']
})
export class CoreDemoComponent implements OnInit {

    module = AppDemo.coreModule;

    constructor() {
    }

    ngOnInit() {

    }


}

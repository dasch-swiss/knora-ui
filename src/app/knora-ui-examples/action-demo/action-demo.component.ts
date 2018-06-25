import {Component, OnInit} from '@angular/core';
import {AppDemo} from '../../app.config';

@Component({
    selector: 'app-action-demo',
    templateUrl: './action-demo.component.html',
    styleUrls: ['./action-demo.component.scss']
})
export class ActionDemoComponent implements OnInit {

    module = AppDemo.actionModule;

    constructor() {
    }

    ngOnInit() {
    }

}

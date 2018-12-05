import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../../app.config';

@Component({
    selector: 'app-incoming',
    templateUrl: './incoming.component.html',
    styleUrls: ['./incoming.component.scss']
})
export class IncomingComponent implements OnInit {

    module = AppDemo.coreModule;

    constructor() {
    }

    ngOnInit() {
    }

}

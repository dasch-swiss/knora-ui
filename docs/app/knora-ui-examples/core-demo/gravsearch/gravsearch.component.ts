import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../../app.config';

@Component({
    selector: 'app-gravsearch',
    templateUrl: './gravsearch.component.html',
    styleUrls: ['./gravsearch.component.scss']
})
export class GravsearchComponent implements OnInit {

    module = AppDemo.coreModule;

    constructor() {
    }

    ngOnInit() {
    }

}

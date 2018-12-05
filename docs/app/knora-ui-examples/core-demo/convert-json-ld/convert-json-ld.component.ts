import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../../app.config';

@Component({
    selector: 'app-convert-json-ld',
    templateUrl: './convert-json-ld.component.html',
    styleUrls: ['./convert-json-ld.component.scss']
})
export class ConvertJsonLdComponent implements OnInit {

    module = AppDemo.coreModule;

    constructor() {
    }

    ngOnInit() {
    }

}

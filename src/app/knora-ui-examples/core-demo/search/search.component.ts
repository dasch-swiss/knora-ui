import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../../app.config';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

    module = AppDemo.coreModule;

    constructor() {
    }

    ngOnInit() {
    }

}

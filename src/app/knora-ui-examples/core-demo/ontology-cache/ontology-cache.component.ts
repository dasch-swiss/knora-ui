import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../../app.config';

@Component({
    selector: 'app-ontology-cache',
    templateUrl: './ontology-cache.component.html',
    styleUrls: ['./ontology-cache.component.scss']
})
export class OntologyCacheComponent implements OnInit {

    module = AppDemo.coreModule;

    constructor() {
    }

    ngOnInit() {
    }

}

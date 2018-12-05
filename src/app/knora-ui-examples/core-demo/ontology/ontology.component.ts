import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../../app.config';

@Component({
    selector: 'app-ontology',
    templateUrl: './ontology.component.html',
    styleUrls: ['./ontology.component.scss']
})
export class OntologyComponent implements OnInit {

    module = AppDemo.coreModule;

    constructor() {
    }

    ngOnInit() {
    }

}

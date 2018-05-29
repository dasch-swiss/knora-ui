import {Component, OnInit} from '@angular/core';
import {AppDemo} from '../../app.config';
import {Item} from '../../app.interfaces';

@Component({
    selector: 'app-core-demo',
    templateUrl: './core-demo.component.html',
    styleUrls: ['./core-demo.component.scss']
})
export class CoreDemoComponent implements OnInit {

    module = AppDemo.coreModule;

    subModules: Item[] = [
        {
            label: 'Authentication',
            name: 'authentication'
        },
        {
            label: 'Projects',
            name: 'projects'
        },
        {
            label: 'Users',
            name: 'users'
        }
    ];


    constructor() {
    }

    ngOnInit() {

    }



}

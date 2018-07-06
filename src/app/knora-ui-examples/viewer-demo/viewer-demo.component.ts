import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../app.config';

@Component({
    selector: 'app-viewer-demo',
    templateUrl: './viewer-demo.component.html',
    styleUrls: ['./viewer-demo.component.scss']
})
export class ViewerDemoComponent implements OnInit {

    module = AppDemo.viewerModule;

    constructor() {
    }

    ngOnInit() {
    }

}

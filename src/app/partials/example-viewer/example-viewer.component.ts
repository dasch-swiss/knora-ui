import { Component, Input, OnInit } from '@angular/core';
import { Example } from '../../app.interfaces';

@Component({
    selector: 'app-example-viewer',
    templateUrl: './example-viewer.component.html',
    styleUrls: ['./example-viewer.component.scss']
})
export class ExampleViewerComponent implements OnInit {

    @Input() example: Example;

    showCode: boolean = false;

    constructor() {
    }

    ngOnInit() {
    }

    toggleCode() {
        this.showCode = this.showCode !== true;
    }

}

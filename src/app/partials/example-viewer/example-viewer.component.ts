import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Example } from '../../app.interfaces';

declare var Prism;

@Component({
    selector: 'app-example-viewer',
    templateUrl: './example-viewer.component.html',
    styleUrls: ['./example-viewer.component.scss']
})
export class ExampleViewerComponent implements OnInit, AfterViewInit {

    @Input() example: Example;

    markup: string;
    typescript: string;
    style: string;

    showCode: boolean = false;

    constructor() {
    }

    ngOnInit() {
    }

    toggleCode() {
        this.showCode = this.showCode !== true;
    }

    ngAfterViewInit() {
        this.markup = Prism.highlight(this.example.code.html, Prism.languages.markup);
        this.typescript = Prism.highlight(this.example.code.ts, Prism.languages.javascript);
        this.style = Prism.highlight(this.example.code.scss, Prism.languages.scss);
    }

}

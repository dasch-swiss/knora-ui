import { Component, Input, OnInit } from '@angular/core';
import { JsdocService } from '../services/jsdoc.service';

@Component({
    selector: 'app-documentation-viewer',
    templateUrl: './documentation-viewer.component.html',
    styleUrls: ['./documentation-viewer.component.scss']
})
export class DocumentationViewerComponent implements OnInit {

    @Input() name: string;
    @Input() module: string;

    documentation: any;

    constructor(private _jsdoc: JsdocService) {
    }

    ngOnInit() {

        this._jsdoc.readJson(this.module, this.name).subscribe(
            (result: any) => {
                this.documentation = result;
            },
            (error: any) => {
                console.error(error);
            }
        );
    }

}

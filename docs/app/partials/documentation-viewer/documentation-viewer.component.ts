import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemoModule, Example } from '../../app.interfaces';
import { JsdocService } from '../services/jsdoc.service';

@Component({
    selector: 'app-documentation-viewer',
    templateUrl: './documentation-viewer.component.html',
    styleUrls: ['./documentation-viewer.component.scss']
})
export class DocumentationViewerComponent implements OnInit {

    loading: boolean = true;

    @Input() module: DemoModule = new DemoModule();

    // @Input() examples?: Example[];

    documentation: any;

    currentComponent: DemoModule;

    constructor(private _jsdoc: JsdocService,
                private _route: ActivatedRoute) {
    }

    ngOnInit() {

        // get child route to include the stackblitz example, if it exists
        this._route.url.subscribe((url: any) => {
            this.currentComponent = this.findChild(url[0].path);
            this.loading = false;
        });


        // read the JSDocs documentation json
        this._jsdoc.readJson(this.module.name, this.currentComponent.name).subscribe(
            (result: any) => {
                this.documentation = result;
            },
            (error: any) => {
                console.error(error);
            }
        );
    }

    findChild(currentComp: string) {
        return this.module.children.find((obj: any) => {
            return obj.name === currentComp;
        });
    }

}

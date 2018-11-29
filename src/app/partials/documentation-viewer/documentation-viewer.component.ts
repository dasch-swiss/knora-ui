import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from '../../app.config';
import { DemoModule } from '../../app.interfaces';
import { JsdocService } from '../services/jsdoc.service';

@Component({
    selector: 'app-documentation-viewer',
    templateUrl: './documentation-viewer.component.html',
    styleUrls: ['./documentation-viewer.component.scss']
})
export class DocumentationViewerComponent implements OnInit {

    @Input() module: DemoModule = new DemoModule();

    documentation: any;

    stackBlitzDemo: string;
    currentComponent: DemoModule;

    constructor(private _jsdoc: JsdocService,
                private _route: ActivatedRoute) {
    }

    ngOnInit() {

        console.log(this.module);

        // get child route to include the stackblitz example, if it exists
        this._route.url.subscribe((url: any) => {

            this.currentComponent = this.findChild(url[0].path);

            if (this.currentComponent !== undefined && this.currentComponent.stackblitz === true) {
                this.stackBlitzDemo = AppConfig.stackblitz + AppConfig.prefix + '-' + this.currentComponent.name + AppConfig.parameter;
            }

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

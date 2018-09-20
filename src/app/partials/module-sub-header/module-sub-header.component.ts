import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppDemoLink } from '../../app.demo';
import { DemoModule } from '../../app.interfaces';

@Component({
    selector: 'app-module-sub-header',
    templateUrl: './module-sub-header.component.html',
    styleUrls: ['./module-sub-header.component.scss']
})
export class ModuleSubHeaderComponent implements OnInit {

    @Input() demo: DemoModule = new DemoModule();

    stackBlitzDemo: string;
    currentComponent: DemoModule;

    constructor(private _route: ActivatedRoute) {
    }

    ngOnInit() {

        // get child route to set a stackblitz link
        this._route.url.subscribe((url: any) => {

            this.currentComponent = this.findChild(url[0].path);

            if (this.currentComponent !== undefined && this.currentComponent.stackblitz === true) {
                this.stackBlitzDemo = AppDemoLink.stackblitz + AppDemoLink.prefix + '-' + this.currentComponent.name;
            }

        });
    }


    findChild(currentComp: string) {
        return this.demo.children.find((obj: any) => {
            return obj.name === currentComp;
        });
    }
}

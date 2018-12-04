import { Component, Input, OnInit } from '@angular/core';
import { AppConfig } from '../../app.config';
import { DemoModule } from '../../app.interfaces';

@Component({
    selector: 'app-module-header',
    templateUrl: './module-header.component.html',
    styleUrls: ['./module-header.component.scss']
})
export class ModuleHeaderComponent implements OnInit {

    // module info
    @Input() module: DemoModule;

    // demo of current component, service etc.
    @Input() demo: DemoModule;

    package: string;
    badge: string;

    stackBlitzDemo: string;

    constructor() {
    }

    ngOnInit() {

        console.log(this.demo);

        if (this.module.published) {

            const packageName: string = '@' + AppConfig.prefix + '/' + this.module.name;

            const urlEncode = encodeURIComponent(packageName);

            this.package = AppConfig.npm + urlEncode;
            this.badge = AppConfig.badge + urlEncode + '.svg';

        }

        if (this.demo !== undefined && this.demo.stackblitz) {
            this.stackBlitzDemo = AppConfig.stackblitz + AppConfig.prefix + '-' + this.demo.name + AppConfig.parameter;
        }
    }
}

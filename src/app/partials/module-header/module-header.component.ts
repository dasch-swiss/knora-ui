import { Component, Input, OnInit } from '@angular/core';
import { AppDemoLink } from '../../app.demo';
import { DemoModule } from '../../app.interfaces';

@Component({
    selector: 'app-module-header',
    templateUrl: './module-header.component.html',
    styleUrls: ['./module-header.component.scss']
})
export class ModuleHeaderComponent implements OnInit {

    @Input() demo: DemoModule = new DemoModule();

    package: string;
    badge: string;

    constructor() {
    }

    ngOnInit() {

        if (this.demo.published) {

            const packageName: string = '@' + AppDemoLink.prefix + '/' + this.demo.name;

            const urlEncode = encodeURIComponent(packageName);

            this.package = AppDemoLink.npm + urlEncode;
            this.badge = AppDemoLink.badge + urlEncode + '.svg';

        }

    }

}

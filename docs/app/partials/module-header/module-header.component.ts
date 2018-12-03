import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from '../../app.config';
import { DemoModule, Item } from '../../app.interfaces';

@Component({
    selector: 'app-module-header',
    templateUrl: './module-header.component.html',
    styleUrls: ['./module-header.component.scss']
})
export class ModuleHeaderComponent implements OnInit {

    // module info
    @Input() module: DemoModule = new DemoModule();

    // demo of current component, service etc.
    @Input() child: DemoModule = new DemoModule();

    // TODO: remove the demo input after refactor all demo components
    @Input() demo: DemoModule;

    package: string;
    badge: string;

    constructor() {
    }

    ngOnInit() {

        if (this.module.published) {

            const packageName: string = '@' + AppConfig.prefix + '/' + this.module.name;

            const urlEncode = encodeURIComponent(packageName);

            this.package = AppConfig.npm + urlEncode;
            this.badge = AppConfig.badge + urlEncode + '.svg';

        }

    }
}

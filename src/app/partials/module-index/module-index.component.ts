import {Component} from '@angular/core';
import {AppDemo} from '../../app.demo';
import {DemoModule} from '../../app.interfaces';


@Component({
    selector: 'app-module-index',
    templateUrl: './module-index.component.html',
    styleUrls: ['./module-index.component.scss']
})
export class ModuleIndexComponent {

    sortKey: string = 'name';

    examples: DemoModule[] = AppDemo.examples;

}

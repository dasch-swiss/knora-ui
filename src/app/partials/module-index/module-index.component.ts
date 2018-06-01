import {Component} from '@angular/core';
import {AppDemo} from '../../app.config';
import {DemoModule} from '../../app.interfaces';


@Component({
    selector: 'app-module-index',
    templateUrl: './module-index.component.html',
    styleUrls: ['./module-index.component.scss']
})
export class ModuleIndexComponent {

    examples: DemoModule[] = AppDemo.examples;

}

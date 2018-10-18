import {Component} from '@angular/core';
import {AppDemo} from '../../app.config';
import {DemoModule} from '../../app.interfaces';


@Component({
    selector: 'app-module-index',
    templateUrl: './module-index.component.html',
    styleUrls: ['./module-index.component.scss']
})
export class ModuleIndexComponent {

    sortKey: string = 'name';

    curIndex: number;

    examples: DemoModule[] = AppDemo.examples;

    toggleChildren(index: number) {
        this.curIndex = (index === this.curIndex ? undefined : index);
    }

}

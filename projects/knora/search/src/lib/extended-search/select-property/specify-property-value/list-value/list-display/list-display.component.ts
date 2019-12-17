import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ListNodeV2 } from '@knora/api';

@Component({
    selector: 'list-display',
    templateUrl: './list-display.component.html',
    styleUrls: ['./list-display.component.scss']
})
export class ListDisplayComponent {

    @Input() children: ListNodeV2[];

    @Output() selectedNode: EventEmitter<ListNodeV2> = new EventEmitter<ListNodeV2>();

    @ViewChild('childMenu', { static: true }) public childMenu: MatMenuTrigger;

    constructor() {
    }

    setValue(item: ListNodeV2) {
        this.selectedNode.emit(item);
    }

}

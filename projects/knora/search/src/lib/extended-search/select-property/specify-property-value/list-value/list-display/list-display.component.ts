import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ListNode } from '@knora/api';

@Component({
    selector: 'list-display',
    templateUrl: './list-display.component.html',
    styleUrls: ['./list-display.component.scss']
})
export class ListDisplayComponent {

    @Input() children: ListNode[];

    @Output() selectedNode: EventEmitter<ListNode> = new EventEmitter<ListNode>();

    @ViewChild('childMenu', { static: true }) public childMenu: MatMenuTrigger;

    constructor() {
    }

    setValue(item: ListNode) {
        this.selectedNode.emit(item);
    }

}

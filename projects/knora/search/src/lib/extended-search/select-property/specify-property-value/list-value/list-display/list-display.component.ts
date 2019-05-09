import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ListNodeV2 } from '@knora/core';
import { MatMenuTrigger } from '@angular/material';

@Component({
    selector: 'list-display',
    templateUrl: './list-display.component.html',
    styleUrls: ['./list-display.component.scss']
})
export class ListDisplayComponent implements OnInit {

    @Input() children: ListNodeV2[];

    @Output() selectedNode: EventEmitter<ListNodeV2> = new EventEmitter<ListNodeV2>();

    @ViewChild('childMenu') public childMenu: MatMenuTrigger;

    constructor () {
    }

    ngOnInit() {
        // console.log(this.children)
    }

    setValue(item: ListNodeV2) {
        this.selectedNode.emit(item);
    }

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'kui-table-view',
    templateUrl: './table-view.component.html',
    styleUrls: ['./table-view.component.scss']
})
export class TableViewComponent implements OnInit {

    @Input() result;
    @Input() ontologyInfo;

    constructor() { }

    ngOnInit() {
    }

}

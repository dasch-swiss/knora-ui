import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-sort-button',
    templateUrl: './sort-button.component.html',
    styleUrls: ['./sort-button.component.scss']
})
export class SortButtonComponent implements OnInit {

    sortProps: any = [
        {
            key: 'shortcode',
            label: 'Short code'
        },
        {
            key: 'shortname',
            label: 'Short name'
        },
        {
            key: 'longname',
            label: 'Long name'
        }
    ];

    sortKey: string = 'longname';

    constructor() {
    }

    ngOnInit() {
    }

}

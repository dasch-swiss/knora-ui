import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-sort-button',
    templateUrl: './sort-button.component.html',
    styleUrls: ['./sort-button.component.scss']
})
export class SortButtonComponent implements OnInit {

    sortProps: any = [
        {
            key: 'prename',
            label: 'Prename'
        },
        {
            key: 'lastname',
            label: 'Last name'
        },
        {
            key: 'creator',
            label: 'Creator'
        }
    ];

    sortKey: string = 'creator';

    list = [
        {
            prename: 'Gaston',
            lastname: 'Lagaffe',
            creator: 'André Franquin'

        },
        {
            prename: 'Mickey',
            lastname: 'Mouse',
            creator: 'Walt Disney'

        },
        {
            prename: 'Donald',
            lastname: 'Duck',
            creator: 'Walt Disney'

        },
        {
            prename: 'Charlie',
            lastname: 'Brown',
            creator: 'Charles M. Schulz'

        }
    ];

    constructor() {
    }

    ngOnInit() {
    }

}

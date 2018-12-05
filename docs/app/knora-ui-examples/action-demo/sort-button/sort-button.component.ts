import { Component, OnInit } from '@angular/core';
import { Example } from '../../../app.interfaces';
import { AppDemo } from '../../../app.config';


@Component({
    selector: 'app-sort-button',
    templateUrl: './sort-button.component.html',
    styleUrls: ['./sort-button.component.scss']
})
export class SortButtonComponent implements OnInit {

    module = AppDemo.actionModule;

    sortProps: any = [{
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

    list = [{
        prename: 'Charlie',
        lastname: 'Brown',
        creator: 'Charles M. Schulz'
    },
    {
        prename: 'Donald',
        lastname: 'Duck',
        creator: 'Walt Disney'
    },
    {
        prename: 'Gaston',
        lastname: 'Lagaffe',
        creator: 'André Franquin'

    },
    {
        prename: 'Mickey',
        lastname: 'Mouse',
        creator: 'Walt Disney'
    }
    ];



    // demo configuration incl. code to display
    sortButtonCode: Example = {
        title: 'Simple Example',
        subtitle: '',
        name: 'sortbutton',
        code: {
            html: `
    <kui-sort-button [sortProps]="sortProps" [(sortKey)]="sortKey"></kui-sort-button>

    <ul>
        <li *ngFor="let item of list | sortBy: sortKey">
            <span [class.active]="sortKey === 'prename'">{{item.prename}} </span>
            <span [class.active]="sortKey === 'lastname'">{{item.lastname}} </span>
            by
            <span [class.active]="sortKey === 'creator'">{{item.creator}}</span>
        </li>
    </ul>`,
            ts: `
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
            ];`,
            scss: ''
        }
    };

    constructor() { }

    ngOnInit() { }

}

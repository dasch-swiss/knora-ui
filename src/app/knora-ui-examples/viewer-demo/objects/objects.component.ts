import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../../app.demo';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-objects',
    templateUrl: './objects.component.html',
    styleUrls: ['./objects.component.scss']
})
export class ObjectsComponent implements OnInit {

    partOf: any;

    constructor(private _route: ActivatedRoute) {
        this._route.data
            .subscribe(
                (mod: any) => {
                    this.partOf = mod.partOf;
                }
            );
    }

    ngOnInit() {
    }

}

import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../app.demo';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-viewer-demo',
    templateUrl: './viewer-demo.component.html',
    styleUrls: ['./viewer-demo.component.scss']
})
export class ViewerDemoComponent implements OnInit {

    module: any;

    constructor(private _route: ActivatedRoute) {
        this._route.data
            .subscribe(
                (data: any) => {
                    this.module = data.module;
                }
            );
    }

    ngOnInit() {
    }

}

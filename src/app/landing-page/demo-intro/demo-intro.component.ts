import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-demo-intro',
    templateUrl: './demo-intro.component.html',
    styleUrls: ['./demo-intro.component.scss']
})
export class DemoIntroComponent implements OnInit {

    @Input() module: string;

    constructor(private _route: ActivatedRoute) {
    }

    ngOnInit() {

        this._route
            .data
            .subscribe(
                (data: any) => {
                    this.module = data.module;
                }
            );

    }

}

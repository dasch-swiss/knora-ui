import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var Prism;

@Component({
    selector: 'app-demo-intro',
    templateUrl: './demo-intro.component.html',
    styleUrls: ['./demo-intro.component.scss']
})
export class DemoIntroComponent implements OnInit, AfterViewInit {

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

    ngAfterViewInit() {
        const code = 'var data = 1;';
        // this.myCode = Prism.highlight(code, Prism.languages.javascript);
    }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppDemo } from '../../../app.config';

@Component({
    selector: 'app-views',
    templateUrl: './views.component.html',
    styleUrls: ['./views.component.scss']
})
export class ViewsComponent implements OnInit {

    module = AppDemo.viewerModule;

    constructor() {
    }

    ngOnInit() {
    }

}

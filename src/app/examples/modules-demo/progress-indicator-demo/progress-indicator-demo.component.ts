import {Component, OnInit} from '@angular/core';
import {AppDemo} from '../../../app.config';

@Component({
    selector: 'app-progress-indicator-demo',
    templateUrl: './progress-indicator-demo.component.html',
    styleUrls: ['./progress-indicator-demo.component.scss']
})
export class ProgressIndicatorDemoComponent implements OnInit {

    module = AppDemo.progressIndicator;

    examples = [
        {
            status: -1,
            label: 'before submit (not ready)'
        },
        {
            status: 0,
            label: 'submitting'
        },
        {
            status: 1,
            label: 'after submit (done)'
        },
        {
            status: 400,
            label: 'in case of an error'
        }
    ];

    status = -1;

    constructor() {
    }

    ngOnInit() {
        this.refresh();
    }

    // only for testing the change of status
    refresh() {
        setTimeout(() => {
            // Do Something Here
            if (this.status === 1) {
                this.status -= 2;
            } else {
                this.status++;
            }
            // Then recall the parent function to
            // create a recursive loop.
            this.refresh();
        }, 2500);

    }

}

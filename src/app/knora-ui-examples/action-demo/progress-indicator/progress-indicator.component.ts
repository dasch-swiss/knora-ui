import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../../app.config';
import { Example } from '../../../app.interfaces';

@Component({
    selector: 'app-progress-indicator-demo',
    templateUrl: './progress-indicator.component.html',
    styleUrls: ['./progress-indicator.component.scss']
})
export class ProgressIndicatorComponent implements OnInit {

    module = AppDemo.actionModule;

    // demo configuration incl. code to display
    classicLoader: Example = {
        title: 'Classic Loader',
        subtitle: '',
        name: 'classicLoader',
        code: {
            html: `<kui-progress-indicator></kui-progress-indicator>`,
            ts: '',
            scss: ''
        }
    };

    // demo configuration incl. code to display
    submitLoader: Example = {
        title: 'Submit-form-data loader',
        subtitle: 'e.g. as a list style type while submitting form data',
        name: 'submitLoader',
        code: {
            html: `
<mat-list>
    <mat-list-item *ngFor="let item of examples">
        <kui-progress-indicator mat-list-avatar [status]="item.status">
        </kui-progress-indicator>
        <p mat-line>
          <strong>
            <span>{{item.label}}</span>
          </strong>
        </p>
        <p mat-line>
          status: {{item.status}}
        </p>
    </mat-list-item>
</mat-list>`,
            ts: `
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
            `,
            scss: ''
        }
    };

    // demo configuration: dynamic example
    dynamicExample: Example = {
        title: 'Dynamic example of ' + this.submitLoader.title,
        subtitle: '',
        name: 'dynamicExample',
        code: {
            html: `<mat-list>
                      <mat-list-item>
                        <kui-progress-indicator mat-list-avatar [status]="status" color="blue"></kui-progress-indicator>
                        <p mat-line>
                          <strong>
                            <span *ngIf="status == -1">before submit (not ready)</span>
                            <span *ngIf="status == 0">submitting</span>
                            <span *ngIf="status == 1">after submit (done)</span>
                          </strong>
                          status: {{status}}
                        </p>
                      </mat-list-item>
                </mat-list>`,
            ts: `examples = [
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
                        if (this.status === 1) {
                            this.status -= 2;
                        } else {
                            this.status++;
                        }
                        // Then recall the parent function to
                        // create a recursive loop.
                        this.refresh();
                    }, 2500);
                }`,
            scss: ''
        }
    };

    // configuration data
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

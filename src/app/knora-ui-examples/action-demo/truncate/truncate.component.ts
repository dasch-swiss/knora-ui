import { Component, OnInit } from '@angular/core';
import { AppDemo } from 'src/app/app.config';
import { Example } from 'src/app/app.interfaces';

@Component({
    selector: 'app-truncate',
    templateUrl: './truncate.component.html',
    styleUrls: ['./truncate.component.scss']
})
export class TruncateComponent implements OnInit {

    module = AppDemo.actionModule;

    // demo configuration incl. code to display
    keyPipe: Example = {
        title: 'Key Pipe',
        subtitle: '',
        name: 'keyPipe',
        code: {
            html: `
<ul>
    <li *ngFor="let item of array | kuiKey">
        {{item.key}}: {{item.value}}
    </li>
</ul>`,
            ts: `
array = [];

this.array['index-1'] = 'Value in index 1';
this.array['index-2'] = 'Value in index 2';
this.array['index-3'] = 'Value in index 3';
`,
            scss: ''
        }
    };

    array = [];


    constructor () {
    }

    ngOnInit() {
        this.array['index-1'] = 'Value in index 1';
        this.array['index-2'] = 'Value in index 2';
        this.array['index-3'] = 'Value in index 3';

    }

}

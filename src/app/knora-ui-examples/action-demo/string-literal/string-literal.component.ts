import { Component, OnInit } from '@angular/core';
import { AppDemo } from 'src/app/app.config';
import { Example } from 'src/app/app.interfaces';
import { StringLiteral } from '@knora/core';

@Component({
    selector: 'app-string-literal',
    templateUrl: './string-literal.component.html',
    styleUrls: ['./string-literal.component.scss']
})
export class StringLiteralComponent implements OnInit {

    module = AppDemo.actionModule;

    labels: StringLiteral[] = [
        {
            value: 'Welt',
            language: 'de'
        },
        {
            value: 'World',
            language: 'en'
        },
        {
            value: 'Monde',
            language: 'fr'
        },
        {
            value: 'Mondo',
            language: 'it'
        },
    ];

    // demo configuration incl. code to display
    stringifyPipe: Example = {
        title: 'StringifyStringLiteral Pipe',
        subtitle: '',
        name: 'stringifyPipe',
        code: {
            html: `
<strong>Show all values</strong>
<p>{{labels | kuiStringifyStringLiteral:'all'}}</p>

<strong>Show only one value</strong>
<p>{{labels | kuiStringifyStringLiteral}}</p>
`,
            ts: `
labels: StringLiteral[] = '` + JSON.stringify(this.labels) + `';
`,
            scss: ''
        }
    };

    constructor () { }

    ngOnInit() {
    }

}

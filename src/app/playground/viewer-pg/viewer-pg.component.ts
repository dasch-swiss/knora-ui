import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-viewer-pg',
    templateUrl: './viewer-pg.component.html',
    styleUrls: ['./viewer-pg.component.scss']
})
export class ViewerPgComponent implements OnInit {

    // example of a few resources:
    resources: any[] = [
        {
            'name': 'page',
            'iri': 'http://rdfh.ch/0803/18a671b8a601'
        },
        {
            'name': 'book',
            'iri': 'http://rdfh.ch/0803/5e77e98d2603'
        },
        {
            'name': 'still image resource',
            'iri': 'http://rdfh.ch/00FF/0cb8286054d5'
        }
    ];

    constructor(private _router: Router) {
    }

    ngOnInit() {
    }

    openResource(id: string) {
        const goTo: string = 'playground/viewer/resource/' + encodeURIComponent(id);

        this._router.navigateByUrl('/playground/viewer', {skipLocationChange: true}).then(() =>
            this._router.navigate([goTo])
        );

    }

}

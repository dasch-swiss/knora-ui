import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StillImageRepresentation } from '../../../../../projects/knora/core/src/lib/declarations';
import { AppDemo } from '../../../app.config';

@Component({
    selector: 'app-resources',
    templateUrl: './resources.component.html',
    styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

    partOf = AppDemo.viewerModule;

    stillImage: any[];

    constructor(private _route: ActivatedRoute) {
        this._route.data
            .subscribe(
                (mod: any) => {
                    this.partOf = mod.partOf;
                }
            );
    }

    ngOnInit() {
        this.stillImage = [
            {
                stillImageFileValue: {
                    dimX: 3618,
                    dimY: 5202,
                    id: 'http://rdfh.ch/0fb54d8bd503/reps/1aa9fe8e7a07',
                    imageFilename: 'load_test.jpx',
                    imagePath: 'http://localhost:1024/knora/load_test.jpx/full/3479,5131/0/default.jpg',
                    imageServerIIIFBaseURL: 'http://localhost:1024/knora',
                    isPreview: false,
                    makeIIIFUrl: '',
                    propIri: 'http://api.knora.org/ontology/knora-api/v2#hasStillImageFileValue',
                    type: 'http://api.knora.org/ontology/knora-api/v2#StillImageFileValue'
                },
                regions: []

            }
            // stillImageFileValue: ''
        ];
    }
}

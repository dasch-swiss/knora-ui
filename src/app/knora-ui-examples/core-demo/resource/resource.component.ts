import {Component, OnInit} from '@angular/core';

declare let require: any;
const jsonld = require('jsonld');

@Component({
    selector: 'app-resource',
    templateUrl: './resource.component.html',
    styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit {

    // example of a resource:
    iri: string = 'http://rdfh.ch/0fb54d8bd503';

    constructor() {
    }

    ngOnInit() {
        this.getResource(this.iri);
    }

    getResource(iri: string) {
        /*
        this.resourceService.getResource(iri)
            .subscribe(
                (result: ApiServiceResult) => {

                    const promises = jsonld.promises;
                    console.log('promises: ', promises);

                    const promise = promises.compact(result.body, {});
                    console.log('promise: ', promise);

                    promise.then((compacted) => {
                        console.log('compacted: ', compacted);
                        let resourceSeq: ReadResourcesSequence = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(compacted);

                    }, function (err) {

                        console.log('JSONLD of full resource request could not be expanded:' + err);
                    });



                    console.log('body: ', result.body);

                },
                (error: ApiServiceError) => {
                    console.error(error);
                }
            );
            */
    }

}

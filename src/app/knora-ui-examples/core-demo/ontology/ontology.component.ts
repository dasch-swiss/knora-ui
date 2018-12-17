import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../../app.config';
import { Example } from '../../../app.interfaces';

@Component({
    selector: 'app-ontology',
    templateUrl: './ontology.component.html',
    styleUrls: ['./ontology.component.scss']
})
export class OntologyComponent implements OnInit {

    module = AppDemo.coreModule;

    exampleOntology: Example = {
        title: 'getOntologiesMetadata()',
        subtitle: 'Requests the metadata about all existing ontologies from Knora\'s ontologies route.',
        name: 'getOntologiesMetadata()',
        code: {
            html: ``,
            ts: `
getOntologiesMetadataFromKnora(): Observable<object> {

    return this._ontologyService.getOntologiesMetadata().pipe(
        mergeMap(
            // this would return an Observable of a PromiseObservable
            // -> combine them into one Observable
            (ontRes: ApiServiceResult) => {
                const ontPromises = jsonld.promises;
                // compact JSON-LD using an empty context: expands all Iris
                const ontPromise = ontPromises.compact(ontRes.body, {});
                // convert promise to Observable and return it
                return from(ontPromise);
    }));
}
`,
            scss: ``
        }
    };

    constructor() {
    }

    ngOnInit() {
    }

}

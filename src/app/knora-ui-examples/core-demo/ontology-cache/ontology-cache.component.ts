import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../../app.config';
import { Example } from '../../../app.interfaces';

@Component({
    selector: 'app-ontology-cache',
    templateUrl: './ontology-cache.component.html',
    styleUrls: ['./ontology-cache.component.scss']
})
export class OntologyCacheComponent implements OnInit {

    module = AppDemo.coreModule;

    exampleOntologyCache: Example = {
        title: 'getResourceClassDefinitions(resourceClassIris)',
        subtitle: 'Returns the definitions for the given resource class Iris.',
        name: 'getResourceClassDefinitions',
        code: {
            html: ``,
            ts: `
// resource class Iris gotten from ConvertJsonLd.getResourceClassesFromJsonLD();
resourceClassIris: string[];

constructor(
    private _cacheService: OntologyCacheService) {}

this._cacheService.getResourceClassDefinitions(resourceClassIris).subscribe(
    (resourceClassInfos: any) => {
        // e.g. initialize ontology information and request incoming resources
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

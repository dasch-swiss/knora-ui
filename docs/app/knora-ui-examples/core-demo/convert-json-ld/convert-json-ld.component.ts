import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../../app.config';
import { Example } from '../../../app.interfaces';

@Component({
    selector: 'app-convert-json-ld',
    templateUrl: './convert-json-ld.component.html',
    styleUrls: ['./convert-json-ld.component.scss']
})
export class ConvertJsonLdComponent implements OnInit {

    module = AppDemo.coreModule;

    exampleConvertJsonLd: Example = {
        title: 'getResourceClassesFromJsonLD(resourcesResponseJSONLD: object)',
        subtitle: 'get the resource classes from JsonLD with the converter',
        name: 'getResourceClassesFromJsonLD',
        code: {
            html: ``,
            ts: `
const resPromises = jsonld.promises;
// compact JSON-LD using an empty context: expands all Iris
const resPromise = resPromises.compact(searchResult.body, {});

resPromise.then((compacted) => {

    // get resource class Iris from response
    const resourceClassIris: string[] = ConvertJSONLD.getResourceClassesFromJsonLD(compacted);

    // e.g. you can then request ontology information about resource class
    // Iris (properties are implied) with the ontology cache service
});
`,
            scss: ``
        }
    };

    constructor() {
    }

    ngOnInit() {
    }

}

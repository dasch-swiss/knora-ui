import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../../app.config';
import { Example } from '../../../app.interfaces';

@Component({
    selector: 'app-incoming',
    templateUrl: './incoming.component.html',
    styleUrls: ['./incoming.component.scss']
})
export class IncomingComponent implements OnInit {

    module = AppDemo.coreModule;

    exampleIncoming: Example = {
        title: 'getIncomingLinksForResource(resourceIri, offset)',
        subtitle: 'Returns all incoming links for the given resource Iri.',
        name: 'getIncomingLinksForResource',
        code: {
            html: ``,
            ts: `
resource: ReadResource;

constructor(
    private _incomingService: IncomingService,
) {}

private getIncomingLinks(offset: number, callback?: (numberOfResources: number) => void): void {
    this._incomingService.getIncomingLinksForResource(this.resource.id, offset).subscribe(
        (result: ApiServiceResult) => {
            // e.g. you can then get resource class iris from the response and
            // request ontology information about resource class Iris
        }
    );
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

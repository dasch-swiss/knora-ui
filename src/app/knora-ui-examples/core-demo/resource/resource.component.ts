import {Component, OnInit} from '@angular/core';
import {ResourceService} from '@knora/core';
import {ApiServiceError} from '../../../../../projects/knora/core/src/lib/declarations';

@Component({
    selector: 'app-resource',
    templateUrl: './resource.component.html',
    styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit {

    iri: string = 'http://rdfh.ch/0fb54d8bd503';

    constructor(public resourceService: ResourceService) {
    }

    ngOnInit() {
        this.getResource(this.iri);
    }

    getResource(iri: string) {
        this.resourceService.getResource(iri)
            .subscribe(
                (result: any) => {
                    console.log(result);
                },
                (error: ApiServiceError) => {
                    console.error(error);
                }
            );
    }

}

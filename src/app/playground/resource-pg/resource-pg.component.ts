import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IncomingService, ResourceService } from '../../../../projects/knora/core/src/lib/services';

@Component({
    selector: 'app-resource-pg',
    templateUrl: './resource-pg.component.html',
    styleUrls: ['./resource-pg.component.scss']
})
export class ResourcePgComponent implements OnInit {

    iri: string;


    constructor(protected _route: ActivatedRoute,
                protected _router: Router,
                protected _resourceService: ResourceService,
                protected _incomingService: IncomingService) {
        this._route.params.subscribe((params: Params) => {
            this.iri = params['id'];
            // console.log(this.iri);
        });
    }

    ngOnInit() {
    }


}

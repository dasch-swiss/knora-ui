import { Component, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';
import {
  ApiServiceError,
  ApiServiceResult,
  ConvertJSONLD,
  ImageRegion,
  IncomingService,
  KnoraConstants,
  OntologyCacheService,
  OntologyInformation,
  ReadLinkValue,
  ReadPropertyItem,
  ReadResource,
  ReadResourcesSequence,
  ReadStillImageFileValue,
  ResourceService,
  StillImageRepresentation,
  Utils
} from '@knora/core';

declare let require: any;
const jsonld = require('jsonld');

@Component({
  selector: 'kui-resource-view',
  templateUrl: './resource-view.component.html',
  styleUrls: ['./resource-view.component.scss']
})
export class ResourceViewComponent implements OnInit {

  @Input() iri: string = 'http://rdfh.ch/2d301f147f03';

  ontologyInfo: OntologyInformation; // ontology information about resource classes and properties present in the requested resource with Iri `iri`
  resource: ReadResource; // the resource to be displayed
  errorMessage: any;

  KnoraConstants = KnoraConstants;

  constructor(
    private _resourceService: ResourceService,
    private _cacheService: OntologyCacheService,
    private _incomingService: IncomingService) { }

  ngOnInit() {
    this.getResource(this.iri);
  }

  private getResource(iri: string): void {
    this._resourceService.getResource(iri)
      .subscribe(
        (result: ApiServiceResult) => {
          console.log('result: ', result.body);
          const promises = jsonld.promises;
          // compact JSON-LD using an empty context: expands all Iris
          const promise = promises.compact(result.body, {});

          promise.then((compacted) => {

            const resourceSeq: ReadResourcesSequence = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(compacted);

            // make sure that exactly one resource is returned
            if (resourceSeq.resources.length === 1) {

              // get resource class Iris from response
              const resourceClassIris: string[] = ConvertJSONLD.getResourceClassesFromJsonLD(compacted);

              // request ontology information about resource class Iris (properties are implied)
              this._cacheService.getResourceClassDefinitions(resourceClassIris).subscribe(
                (resourceClassInfos: any) => {
                  // initialize ontology information
                  this.ontologyInfo = resourceClassInfos; // console.log('initialization of ontologyInfo: ', this.ontologyInfo); > object received

                  // prepare a possibly attached image file to be displayed
                  // this.collectImagesAndRegionsForResource(resourceSeq.resources[0]);

                  this.resource = resourceSeq.resources[0];
                  // console.log('resource: ', this.resource);

                  // this.requestIncomingResources();
                },
                (err) => {

                  console.log('cache request failed: ' + err);
                });
            } else {
              // exactly one resource was expected, but resourceSeq.resources.length != 1
              this.errorMessage = `Exactly one resource was expected, but ${resourceSeq.resources.length} resource(s) given.`;
            }
          }, function (err) {
            console.error('JSONLD of full resource request could not be expanded:' + err);
          });
          // this.isLoading = false;
        },
        (error: ApiServiceError) => {
          console.error(error);
          // this.errorMessage = <any>error;
          // this.isLoading = false;
        });
  }

}

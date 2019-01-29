import { Component, OnInit } from '@angular/core';
import { ApiServiceError, ApiServiceResult, NewOntology, OntologyService, Project, ProjectsService } from '@knora/core';


@Component({
    selector: 'app-ontology-pg',
    templateUrl: './ontology-pg.component.html',
    styleUrls: ['./ontology-pg.component.scss']
})
export class OntologyPgComponent implements OnInit {

    loading: boolean = true;
    disabled: boolean = true;

    projectcode: string = '0001';

    project: Project;

    ontologies: any;

    itemPluralMapping = {
        'ontology': {
            '=1': '1 Ontology',
            'other': '# Ontologies'
        }
    };

    constructor(private _projectsService: ProjectsService,
                private _ontologyService: OntologyService) {
    }

    ngOnInit() {

        // get project, to get a list of ontologies

        this._projectsService.getProjectByShortcode(this.projectcode).subscribe(
            (response: Project) => {
                this.project = response;
                this.loadOntologies(this.project.id);
            },
            (error: ApiServiceError) => {
                console.error(error);
                this.loading = false;
            }
        );
    }

    loadOntologies(id: string) {
        // get the project ontologies by project id (iri)
        this._ontologyService.getProjectOntologies(id).subscribe(
            (result: ApiServiceResult) => {

                if (result.body['@graph']) {
                    this.ontologies = result.body['@graph'];
                } else {
                    const ontology = {
                        '@id': result.body['@id'],
                        '@type': result.body['@type'],
                        'knora-api:attachedToProject': result.body['knora-api:attachedToProject'],
                        'knora-api:lastModificationDate': result.body['knora-api:lastModificationDate'],
                        'rdfs:label': result.body['rdfs:label']
                    };
                    this.ontologies = [ontology];
                }

                this.loading = false;
            },
            (error: any) => {
                console.error(error);
            }
        );

    }

    removeOntology(id: string) {
        console.log(id);
    }

    createOntology() {
        this.loading = true;

        const something: number = Math.floor(Math.random() * Math.floor(9999));

        const ontologyData: NewOntology = {
            projectIri: this.project.id,
            name: this.project.shortname + '-data-model-' + something,
            label: 'Data Model (Ontology) for ' + this.project.shortname + ' (N° ' + something + ')'
        };
        this._ontologyService.createOntology(ontologyData).subscribe(
            (ontology: any) => {
                this.loadOntologies(this.project.id);

            },
            (error: any) => {
                console.error(error);
            }
        );
    }

}

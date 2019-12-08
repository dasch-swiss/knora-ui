import { StringLiteral } from '@knora/api';

export interface NewResourceClass {

    // id = onto_name + ':' + class_name

    ontologyIri: string;
    name: string;
    labels: StringLiteral[];
    comments: StringLiteral[];
    subClassOf: string;
}

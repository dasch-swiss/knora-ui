import { StringLiteral } from '@knora/api';

export interface NewProperty {

    // id = onto_name + ':' + prop_name

    ontologyIri: string;
    name: string;
    labels: StringLiteral[];
    comments: StringLiteral[];
    subPropertyOf: string;
    guiElement: string;
    guiOrder: number;
    guiAttributes: string[];

}

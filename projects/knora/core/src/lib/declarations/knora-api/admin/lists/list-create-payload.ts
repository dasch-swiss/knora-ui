import {StringLiteral} from '../../../';


export interface ListCreatePayload {

    // always needed
    projectIri: string;

    // should have at least one label
    labels: StringLiteral[];

    // can be empty
    comments: StringLiteral[];
}

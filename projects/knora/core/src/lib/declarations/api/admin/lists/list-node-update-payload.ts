import { StringLiteral } from '../../../';


export interface ListNodeUpdatePayload {

    // required
    parentNodeIri: string;

    // required
    projectIri: string;

    // not sure if it's required
    name: string;

    // at least one label needs to be supplied
    labels: StringLiteral[];

    // can be an empty array
    comments: StringLiteral[];
}

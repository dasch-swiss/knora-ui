import { StringLiteral } from '../../../';


export interface ListInfoUpdatePayload {

    // required
    listIri: string;

    // required
    projectIri: string;

    // can be an empty array
    labels: StringLiteral[];

    // can be an empty array
    comments: StringLiteral[];
}

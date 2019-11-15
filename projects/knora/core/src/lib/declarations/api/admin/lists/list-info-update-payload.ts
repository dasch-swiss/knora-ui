import { StringLiteral } from '../../../';

/**
 * @deprecated Use new model from `@knora/api` (github:dasch-swiss/knora-api-js-lib) instead
 */
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

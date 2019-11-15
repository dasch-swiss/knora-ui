import { StringLiteral } from '../../../';

/**
 * @deprecated Use new model from `@knora/api` (github:dasch-swiss/knora-api-js-lib) instead
 */
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

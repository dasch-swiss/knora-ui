import { StringLiteral } from '../../../';

/**
 * @deprecated since v9.5.0 - Use new model from `@knora/api` (github:dasch-swiss/knora-api-js-lib) instead
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

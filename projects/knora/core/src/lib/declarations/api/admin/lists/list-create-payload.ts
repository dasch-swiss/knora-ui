import { StringLiteral } from '@knora/api';

/**
 * @deprecated Use new model from `@knora/api` (github:dasch-swiss/knora-api-js-lib) instead
 */
export interface ListCreatePayload {

    // always needed
    projectIri: string;

    // should have at least one label
    labels: StringLiteral[];

    // can be empty
    comments: StringLiteral[];
}

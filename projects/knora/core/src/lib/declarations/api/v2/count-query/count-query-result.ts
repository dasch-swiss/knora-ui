/**
 * @deprecated Use new model from @knora/api (github:dasch-swiss/knora-api-js-lib) instead
 *
 * Represents the result of a count query.
 */
export class CountQueryResult {

    /**
     *
     * @param numberOfResults total number of results for a query.
     */
    constructor(public readonly numberOfResults: number) {

    }
}

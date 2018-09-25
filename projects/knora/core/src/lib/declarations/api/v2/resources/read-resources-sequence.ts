import { ReadResource } from './read-resource';

/**
 * Represents a sequence of resources.
 */
export class ReadResourcesSequence {

    /**
     *
     * @param {Array<ReadResource>} resources given sequence of resources.
     * @param {number} numberOfResources number of given resources.
     */
    constructor(public readonly resources: Array<ReadResource>, public readonly numberOfResources: number) {
    }

}

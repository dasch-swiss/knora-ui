import { ReadResource } from './read-resource';
import { OntologyInformation } from '../../../../services';

/**
 * Represents a sequence of resources.
 */
export class ReadResourcesSequence {

    /**
     * Information about the entities used in the given collection of `ReadResource`.
     */
    public readonly ontologyInformation: OntologyInformation = new OntologyInformation({}, {}, {});

    /**
     *
     * @param {Array<ReadResource>} resources given sequence of resources.
     * @param {number} numberOfResources number of given resources.
     */
    constructor(public readonly resources: Array<ReadResource>, public readonly numberOfResources: number) {
    }

}

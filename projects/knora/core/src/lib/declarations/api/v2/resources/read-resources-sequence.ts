import { ReadResource, Resource } from './read-resource';
import { OntologyInformation } from '../../../../services/v2/ontology-cache.service';

/**
 * @deprecated Use **ResourceSequence** instead
 *
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
    constructor (public readonly resources: Array<ReadResource>, public readonly numberOfResources: number) {
    }

}

export class ResourcesSequence {

    /**
     * Information about the entities used in the given collection of `Resource`.
     */
    public readonly ontologyInformation: OntologyInformation = new OntologyInformation({}, {}, {});

    /**
     *
     * @param {Array<Resource>} resources given sequence of resources.
     * @param {number} numberOfResources number of given resources.
     */
    constructor (public readonly resources: Array<Resource>, public readonly numberOfResources: number) {
    }
}

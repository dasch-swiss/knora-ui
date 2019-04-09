import { ReadProperties, StillImageRepresentation } from '../../../';

/**
 * Represents a resource and its properties.
 */
export class ReadResource {

    /**
     *
     * @param {string} id the resource's Iri.
     * @param {string} type the resource's type (class).
     * @param {string} label the resource's rdfs:label.
     * @param {Array<ReadResource>} incomingRegions regions pointing to this resource, if any (possibly to be queried by additional requests).
     * @param {Array<ReadResource>} incomingStillImageRepresentations still image representations pointing to this resource, if any (possibly to be queried by additional requests).
     * @param {Array<ReadResource>} incomingLinks resources pointing to this resource, if any (possibly to be queried by additional requests).
     * @param {StillImageRepresentation[]} stillImageRepresentationsToDisplay  still image representations to be displayed for this resource, if any (possibly to be queried by additional requests).
     * @param {ReadProperties} properties the resources's properties.
     */
    constructor(
        public readonly id: string,
        public readonly type: string,
        public readonly label: string,
        // TODO: we should use a more generic object here; or what's about incomingSequences?
        public incomingRegions: Array<ReadResource>,
        // TODO: we should use a more generic object here, something like incomingMedia or incomingFileRepresentation
        public incomingStillImageRepresentations: Array<ReadResource>,
        public incomingLinks: Array<ReadResource>,
        // TODO: we should use a more generic object here, something like media or fileRepresentation
        public stillImageRepresentationsToDisplay: StillImageRepresentation[],
        // TODO: the properties should be a list: Array<ReadProperties> or not?
        public readonly properties?: ReadProperties) {
    }

}

/**
 * This is a temporary class, to test a new resource setup.
 * When it works, we will merge it with the ReadResource object
 */
export class Resource {
    constructor(
        public readonly id: string,
        public readonly type: string,
        public readonly label: string,
        public incomingAnnotations: Array<Resource>,
        public incomingFileRepresentations: Array<Resource>,
        public incomingLinks: Array<ReadResource>,
        public fileRepresentationsToDisplay: Array<ReadResource>,
        public readonly properties?: ReadProperties) {
    }
}

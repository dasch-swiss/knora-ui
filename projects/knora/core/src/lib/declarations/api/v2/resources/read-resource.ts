import { ReadProperties } from '../../../';
import { StillImageRepresentation } from '../still-image/still-image-representation';

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
        public incomingRegions: Array<ReadResource>,
        public incomingStillImageRepresentations: Array<ReadResource>,
        public incomingLinks: Array<ReadResource>,
        public stillImageRepresentationsToDisplay: StillImageRepresentation[],
        public readonly properties?: ReadProperties) {
    }

}

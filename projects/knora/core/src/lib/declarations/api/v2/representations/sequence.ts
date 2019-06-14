import { ReadIntervalValue, ReadResource } from '../../../';
import { KnoraConstants } from '../../knora-constants';

/**
 * Represents a sequence in time-base media.
 * Contains a reference to the resource representing the sequence.
 */

export class Sequence {

    /**
     *
     * @param {ReadResource} sequenceResource a resource of type Region
     */
    constructor (readonly sequenceResource: ReadResource) {

    }

    /**
     * Get all interval information belonging to this sequence.
     *
     * @returns {ReadIntervalValue[]}
     */
    getIntervals() {
        return this.sequenceResource.properties[KnoraConstants.intervalValueHasStart] as ReadIntervalValue[];
    }
}

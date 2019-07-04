import { KnoraConstants } from '../../knora-constants';
import { ReadStillImageFileValue } from '../properties/read-property-item';
import { ImageRegion } from './image-region';

/**
 * Represents an image including its regions.
 */

export class StillImageRepresentation {

    /**
     *
     * @param {ReadStillImageFileValue} stillImageFileValue a [[ReadStillImageFileValue]] representing an image.
     * @param {ImageRegion[]} regions the regions belonging to the image.
     */
    constructor (readonly stillImageFileValue: ReadStillImageFileValue, readonly regions: ImageRegion[], readonly type: string = KnoraConstants.StillImageFileValue) {

    }

}

import { Constants } from '@knora/api';

import { ReadStillImageFileValue } from '../properties/read-property-item';

import { Region } from './region';

/**
 * Represents an image including its regions.
 */

export class StillImageRepresentation {

    /**
     *
     * @param {ReadStillImageFileValue} stillImageFileValue a [[ReadStillImageFileValue]] representing an image.
     * @param {Region[]} regions the regions belonging to the image.
     */
    // TODO: remove "readonly type: string = Constants.StillImageFileValue"
    constructor (readonly stillImageFileValue: ReadStillImageFileValue, readonly regions: Region[], readonly type: string = Constants.StillImageFileValue) {

    }

}

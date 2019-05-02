import { ReadMovingImageFileValue } from '../../../';
import { MovingImageSequence } from './moving-image-sequence';

/**
 * Represents an image including its regions.
 */

export class MovingImageRepresentation {

    /**
     *
     * @param {ReadMovingImageFileValue} movingImageFileValue a [[ReadMovingImageFileValue]] representing a moving-image.
     * @param {MovingImageSequence[]} sequences the sequences belonging to the moving-image.
     */
    constructor(readonly movingImageFileValue: ReadMovingImageFileValue, readonly sequences: MovingImageSequence[]) {

    }

}

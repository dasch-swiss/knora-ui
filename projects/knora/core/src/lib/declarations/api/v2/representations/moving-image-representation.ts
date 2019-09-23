import { KnoraConstants } from '../../knora-constants';
import { ReadMovingImageFileValue } from '../properties/read-property-item';
import { Sequence } from './sequence';

/**
 * Represents a moving image including its sequences.
 */

export class MovingImageRepresentation {

    /**
     *
     * @param {MovingImageFileValue} movingImageFileValue a [[ReadMovingImageFileValue]] representing a moving-image file.
     * @param {Sequence[]} sequences the sequences belonging to the time-base media.
     */
    constructor (readonly movingImageFileValue: ReadMovingImageFileValue, readonly sequences: Sequence[], readonly type: string = KnoraConstants.MovingImageFileValue) {

    }

}

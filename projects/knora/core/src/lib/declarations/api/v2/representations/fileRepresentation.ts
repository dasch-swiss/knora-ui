import { FileValue } from '../properties/read-property-item';
import { Region } from './region';
import { Sequence } from './sequence';


/**
 * Represents an image including its regions or sequences
 */

export class FileRepresentation {

    /**
     *
     * @param {FileValue} fileValue a [[FileValue]] representing a file.
     * @param {Region[]} [regions] the regions belonging to the image.
     * @param {Sequence[]} [sequences] the sequences belonging to the time-based media.
     */
    constructor (readonly fileValue: FileValue, readonly regions?: Region[], readonly sequences?: Sequence[]) {

    }

}

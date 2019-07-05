import { FileValue } from '../properties/read-property-item';
import { AudioRepresentation } from './audio-representation';
import { MovingImageRepresentation } from './moving-image-representation';
import { Region } from './region';
import { Sequence } from './sequence';
import { StillImageRepresentation } from './still-image-representation';


/**
 * Represents one of the following media file types:
 * - still-image including its regions
 * - moving-image including its sequences
 * - audio including its sequences
 * - text
 * - ddd rti
 * - document
 */
export class oldFileRepresentation {

    /**
     *
     * @param {FileValue} fileValue a [[FileValue]] representing a file.
     * @param {Region[]} [regions] the regions belonging to the image.
     * @param {Sequence[]} [sequences] the sequences belonging to the time-based media.
     */
    constructor (readonly fileValue: FileValue, readonly regions?: Region[], readonly sequences?: Sequence[]) {

    }

}


export class FileRepresentation {

    constructor (
        readonly stillImage?: StillImageRepresentation[],
        readonly movingImage?: MovingImageRepresentation[],
        readonly audio?: AudioRepresentation[]) {

    }

}
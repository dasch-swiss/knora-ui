import { Constants } from '@knora/api';

import { ReadAudioFileValue } from '../properties/read-property-item';

import { Sequence } from './sequence';

/**
 * Represents an audio file representation including its sequences.
 */

export class AudioRepresentation {

    /**
     *
     * @param {ReadAudioFileValue} audioFileValue a [[ReadAudioFileValue]] representing a audio file
     * @param {Sequence[]} sequences the sequences belonging to the time-base media.
     */
    constructor (readonly audioFileValue: ReadAudioFileValue, readonly sequences: Sequence[], readonly type: string = Constants.AudioFileValue) {

    }

}

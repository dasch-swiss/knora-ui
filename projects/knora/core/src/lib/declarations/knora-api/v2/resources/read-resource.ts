import {ReadProperties} from '..';
import {StillImageRepresentation} from '../still-image/still-image-representation';

export class ReadResource {

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

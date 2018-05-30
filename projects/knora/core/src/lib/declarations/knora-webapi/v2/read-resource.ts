import {ReadProperties} from './read-properties';
import {StillImageRepresentation} from '../../../../view/properties/still-image-osdviewer/still-image-osdviewer.component';
import {ReadPropertyItem} from './read-property-item';

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

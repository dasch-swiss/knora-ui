import {ReadPropertyItem} from '..';
import {KnoraConstants} from '../../../knora-constants';


/**
 * Represents a still image value object.
 */
export class ReadStillImageFileValue implements ReadPropertyItem {

    constructor(readonly id: string,
                readonly propIri,
                readonly imageFilename: string,
                readonly imageServerIIIFBaseURL: string,
                readonly imagePath: string,
                readonly dimX: number,
                readonly dimY: number,
                isPreview?: boolean) {

        this.isPreview = isPreview === undefined ? false : isPreview;

    }

    readonly type = KnoraConstants.StillImageFileValue;

    readonly isPreview: boolean;

    private makeIIIFUrl = function (reduceFactor: number): string {

        if (this.isPreview) {
            return this.imagePath;
        } else {
            let percentage = Math.floor(100 / reduceFactor);

            percentage = (percentage > 0 && percentage <= 100) ? percentage : 50;

            return this.imageServerIIIFBaseURL + '/' + this.imageFilename + '/full/pct:' + percentage.toString() + '/0/default.jpg';
        }

    };

    getContent(): string {
        return this.makeIIIFUrl(4);
    }

    getClassName(): string {
        return KnoraConstants.ReadStillImageFileValue;
    }
}

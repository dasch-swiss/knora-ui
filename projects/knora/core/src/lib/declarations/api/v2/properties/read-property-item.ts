import { ReadResource } from '../../../';
import { OntologyInformation } from '../../../../services';
import { KnoraConstants } from '../../knora-constants';
import { DateRangeSalsah, DateSalsah } from '../../shared/date';

/**
 * An abstract interface representing any value object.
 */
export interface ReadPropertyItem {

    /**
     * The value object's Iri.
     */
    readonly id: string;

    /**
     * The value object's type.
     */
    readonly type: string;

    /**
     * The property pointing to the value object.
     */
    readonly propIri: string;

    /**
     * Gets the class name of the class that implements this interface.
     *
     * @returns {string}
     */
    getClassName(): string;

    /**
     * Gets the value as a string (complexity of the value possibly reduced).
     *
     * @returns {string}
     */
    getContent(): string;
}

/**
 * Abstract class representing a text value object with or without markup.
 */
export abstract class ReadTextValue implements ReadPropertyItem {

    abstract id: string;

    readonly type: string = KnoraConstants.TextValue;

    abstract propIri: string;

    abstract getClassName(): string;

    abstract getContent(): string;
}

/**
 * Represents a text value object without markup (mere character string).
 */
export class ReadTextValueAsString extends ReadTextValue {

    constructor (readonly id: string, readonly propIri: string, readonly str: string) {
        super();
    }

    getClassName(): string {
        return KnoraConstants.ReadTextValueAsString;
    }

    getContent() {
        return this.str;
    }
}

/**
 * Represents resources referred to by standoff links.
 */
export class ReferredResourcesByStandoffLink {
    [index: string]: ReadResource;
}

/**
 * Represents a text value object with markup that has been turned into HTML.
 */
export class ReadTextValueAsHtml extends ReadTextValue {

    constructor (readonly id: string, readonly propIri: string, readonly html: string, readonly referredResources: ReferredResourcesByStandoffLink) {
        super();
    }

    /**
     * Gets information about a resource referred to by a standoff link from a text value.
     *
     * @param {string} resourceIri the Iri of the referred resource.
     * @param {OntologyInformation} ontologyInfo ontology information.
     * @returns {string} information about the referred resource's class and its label.
     */


    getReferredResourceInfo(resourceIri: string, ontologyInfo: OntologyInformation) {
        if (this.referredResources !== undefined && this.referredResources[resourceIri] !== undefined) {

            const resClassLabel = ontologyInfo.getLabelForResourceClass(this.referredResources[resourceIri].type);

            return this.referredResources[resourceIri].label + ` (${resClassLabel})`;
        } else {
            return 'no information found about referred resource (target of standoff link)';
        }
    }


    getClassName(): string {
        return KnoraConstants.ReadTextValueAsHtml;
    }

    getContent() {
        return this.html;
    }

}

/**
 * Represents a text value object with markup as XML.
 */
export class ReadTextValueAsXml extends ReadTextValue {

    constructor (readonly id: string, readonly propIri: string, readonly xml: string, readonly mappingIri: string) {
        super();
    }

    getClassName(): string {
        return KnoraConstants.ReadTextValueAsXml;
    }

    getContent() {
        return this.xml;
    }

}


/**
 * Represents a date value object.
 */
export class ReadDateValue implements ReadPropertyItem {

    constructor (
        readonly id: string,
        readonly propIri: string,
        readonly calendar: string,
        readonly startYear: number,
        readonly endYear: number,
        readonly startEra: string,
        readonly endEra: string,
        readonly startMonth?: number,
        readonly endMonth?: number,
        readonly startDay?: number,
        readonly endDay?: number) {
    }

    readonly type = KnoraConstants.DateValue;

    private separator = '/';

    getDateSalsah(): DateSalsah | DateRangeSalsah {
        if (this.startYear === this.endYear && this.startMonth === this.endMonth && this.startDay === this.endDay && this.startEra === this.endEra) {
            // precise date
            return new DateSalsah(this.calendar, this.startEra, this.startYear, this.startMonth, this.startDay);
        } else {
            // date period
            return new DateRangeSalsah(new DateSalsah(this.calendar, this.startEra, this.startYear, this.startMonth, this.startDay), new DateSalsah(this.calendar, this.endEra, this.endYear, this.endMonth, this.endDay));
        }

    }

    getClassName(): string {
        return KnoraConstants.ReadDateValue;
    }

    getContent() {
        return this.getDateSalsah().getDateAsString();
    }
}

/**
 * Represents a link value object (reification).
 */
export class ReadLinkValue implements ReadPropertyItem {

    constructor (readonly id: string, readonly propIri: string, readonly referredResourceIri: string, readonly referredResource?: ReadResource) {

    }

    readonly type = KnoraConstants.LinkValue;

    getReferredResourceInfo(ontologyInfo: OntologyInformation) {
        if (this.referredResource !== undefined) {

            const resClassLabel = ontologyInfo.getLabelForResourceClass(this.referredResource.type);

            return this.referredResource.label + ` (${resClassLabel})`;
        } else {
            return this.referredResourceIri;
        }
    }

    getClassName(): string {
        return KnoraConstants.ReadLinkValue;
    }

    getContent() {
        if (this.referredResource !== undefined) {
            return this.referredResource.label;
        } else {
            return this.referredResourceIri;
        }
    }
}

/**
 * Represents an integer value object.
 */
export class ReadIntegerValue implements ReadPropertyItem {

    constructor (readonly id: string, readonly propIri: string, readonly integer: number) {

    }

    readonly type = KnoraConstants.IntValue;

    getClassName(): string {
        return KnoraConstants.ReadIntegerValue;
    }

    getContent() {
        return this.integer.toString();
    }

}

/**
 * Represents a decimal value object.
 */
export class ReadDecimalValue implements ReadPropertyItem {

    constructor (readonly id: string, readonly propIri: string, readonly decimal: number) {

    }

    readonly type = KnoraConstants.DecimalValue;

    getClassName(): string {
        return KnoraConstants.ReadDecimalValue;
    }

    getContent() {
        return this.decimal.toString();
    }
}


/**
 * Abstract class for file representations like stillImage, movingImage, audio etc.
 */
export abstract class FileValue implements ReadPropertyItem {

    abstract id: string;

    readonly type: string;

    abstract propIri: string;

    abstract getClassName(): string;

    abstract getContent(): string;
}

/**
 * Represents a still image value object.
 */
export class ReadStillImageFileValue extends FileValue {

    constructor (
        readonly id: string,
        readonly propIri: string,
        readonly imageFilename: string,
        readonly imageServerIIIFBaseURL: string,
        readonly imagePath: string,
        readonly dimX: number,
        readonly dimY: number) {
        super();
    }

    readonly type = KnoraConstants.StillImageFileValue;

    readonly isPreview: boolean;

    makeIIIFUrl(reduceFactor: number): string {

        if (this.isPreview) {
            return this.imagePath;
        } else {
            let percentage = Math.floor(100 / reduceFactor);

            percentage = (percentage > 0 && percentage <= 100) ? percentage : 50;

            return this.imageServerIIIFBaseURL + '/' + this.imageFilename + '/full/pct:' + percentage.toString() + '/0/default.jpg';
        }

    }

    getClassName(): string {
        return KnoraConstants.ReadStillImageFileValue;
    }

    getContent() {
        return this.imagePath;
    }
}

/**
 * Represents a moving image value object.
 */
export class ReadMovingImageFileValue extends FileValue {

    constructor (
        readonly id: string,
        readonly propIri: string,
        readonly filename: string,
        readonly fileServerIIIFBaseURL: string,
        readonly path: string,
        readonly dimX: number,
        readonly dimY: number,
        readonly duration: number,
        readonly fps?: number,
        readonly aspectRatio?: string) {
        super();
    }

    readonly type = KnoraConstants.MovingImageFileValue;

    // preview doesn't include the video file itself
    readonly isPreview: boolean;

    getClassName(): string {
        return KnoraConstants.ReadMovingImageFileValue;
    }

    getContent() {
        return this.path;
    }
}

/**
 * Represents a text representation value object
 */
export class ReadTextFileValue implements ReadPropertyItem {

    constructor (readonly id: string, readonly propIri: string, readonly textFilename: string, readonly textFileURL: string) {

    }

    readonly type = KnoraConstants.TextFileValue;

    getClassName(): string {
        return KnoraConstants.ReadTextFileValue;
    }

    getContent() {
        return this.textFileURL;
    }

}

/**
 * Represents a color value object.
 */
export class ReadColorValue implements ReadPropertyItem {

    constructor (readonly id: string,
        readonly propIri: string,
        readonly colorHex: string) {
    }

    readonly type = KnoraConstants.ColorValue;

    getClassName(): string {
        return KnoraConstants.ReadColorValue;
    }

    getContent() {
        return this.colorHex;
    }
}

/**
 * Represents a point in a 2D-coordinate system (for geometry values).
 */
export class Point2D {
    constructor (public x: number, public y: number) {
    }
}

/**
 * Represents a geometry value parsed from JSON.
 */
export class RegionGeometry {
    constructor (public status: string,
        public lineColor: string,
        public lineWidth: number,
        public points: Point2D[],
        public type: string,
        public radius?: Point2D
    ) {
    }
}

/**
 * Represents a geometry value object.
 */
export class ReadGeomValue implements ReadPropertyItem {

    constructor (readonly id: string, readonly propIri: string, readonly geometryString: string) {

        const geometryJSON = JSON.parse(geometryString);

        const points: Point2D[] = [];
        for (const point of geometryJSON.points) {
            points.push(new Point2D(point.x, point.y));
        }

        let radius;
        if (geometryJSON.radius) {
            radius = new Point2D(geometryJSON.radius.x, geometryJSON.radius.y);
        }

        this.geometry = new RegionGeometry(
            geometryJSON.status,
            geometryJSON.lineColor,
            geometryJSON.lineWidth,
            points,
            geometryJSON.type,
            radius
        );

    }

    readonly geometry: RegionGeometry;

    readonly type = KnoraConstants.GeomValue;

    getClassName(): string {
        return KnoraConstants.ReadGeomValue;
    }

    getContent() {
        return this.geometryString;
    }
}

/**
 * Represents a URI value object.
 */
export class ReadUriValue implements ReadPropertyItem {

    constructor (readonly id: string, readonly propIri: string, readonly uri: string) {

    }

    readonly type = KnoraConstants.UriValue;

    getClassName(): string {
        return KnoraConstants.ReadUriValue;
    }

    getContent() {
        return this.uri;
    }

}

/**
 * Represents a Boolean value object.
 */
export class ReadBooleanValue implements ReadPropertyItem {

    constructor (readonly id: string, readonly propIri: string, readonly bool: boolean) {

    }

    readonly type = KnoraConstants.BooleanValue;

    getClassName(): string {
        return KnoraConstants.ReadBooleanValue;
    }

    getContent() {
        return this.bool.toString();
    }

}

/**
 * Represents an interval value object.
 */
export class ReadIntervalValue implements ReadPropertyItem {

    constructor (readonly id: string, readonly propIri: string, readonly intervalStart: number, readonly intervalEnd: number) {

    }

    readonly type = KnoraConstants.IntervalValue;

    getClassName(): string {
        return KnoraConstants.ReadIntervalValue;
    }

    getContent() {
        return this.intervalStart.toString() + '-' + this.intervalEnd;
    }

}

/**
 * Represents a list value object.
 */
export class ReadListValue implements ReadPropertyItem {

    constructor (readonly id: string, readonly propIri: string, readonly listNodeIri: string) {

    }

    readonly type = KnoraConstants.ListValue;

    getClassName(): string {
        return KnoraConstants.ReadListValue;
    }

    getContent() {
        return this.listNodeIri;
    }

}

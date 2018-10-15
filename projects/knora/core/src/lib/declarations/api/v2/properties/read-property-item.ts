import { ReadResource } from '../../../';
import { KnoraConstants } from '../../knora-constants';

import { OntologyInformation } from '../../../../services';
import { JsonObject, JsonProperty } from 'json2typescript';

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
    getClassName: () => string;
}

/**
 * Represents a text value object without markup (mere character string).
 */
export class ReadTextValueAsString implements ReadPropertyItem {

    constructor(readonly id: string, readonly propIri, readonly str: string) {

    }

    readonly type = KnoraConstants.TextValue;

    getClassName(): string {
        return KnoraConstants.ReadTextValueAsString;
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
export class ReadTextValueAsHtml implements ReadPropertyItem {

    constructor(readonly id: string, readonly propIri, readonly html: string, readonly referredResources: ReferredResourcesByStandoffLink) {

    }

    readonly type = KnoraConstants.TextValue;

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

}

/**
 * Represents a text value object with markup as XML.
 */
export class ReadTextValueAsXml implements ReadPropertyItem {

    constructor(readonly id: string, readonly propIri, readonly xml: string, readonly mappingIri: string) {

    }

    readonly type = KnoraConstants.TextValue;

    getClassName(): string {
        return KnoraConstants.ReadTextValueAsXml;
    }

}


/**
 * Represents a date value object.
 */
export class ReadDateValue implements ReadPropertyItem {

    constructor(
        readonly id: string,
        readonly propIri,
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

    private separator = '-';

    getDateSalsah(): DateSalsah | DateRangeSalsah {

        if (this.startYear === this.endYear && this.startMonth === this.endMonth && this.startDay === this.endDay && this.startEra === this.endEra) {
            // precise date
            return new DateSalsah(this.calendar, this.startEra, this.startYear, this.startMonth, this.startDay);
        } else {
            // period date
            return new DateRangeSalsah(new DateSalsah(this.calendar, this.startEra, this.startYear, this.startMonth, this.startDay), new DateSalsah(this.calendar, this.endEra, this.endYear, this.endMonth, this.endDay));
        }



        /* const dateObj: DateSalsah = new DateSalsah();
        // console.log('dateObj', dateObj);

        let startDate: string;
        let startPrecision: string;

        if (this.startMonth === undefined) {
            // year precision
            startDate = this.startYear.toString();
            startPrecision = 'yyyy';
        } else if (this.startDay === undefined) {
            // month precision
            startDate = this.startYear + this.separator + this.startMonth;
            startPrecision = 'MMMM ' + 'yyyy';
        } else {
            // day precision
            startDate = this.startYear + this.separator + this.startMonth + this.separator + this.startDay;
            startPrecision = 'longDate';
        }

        dateObj.start = { date: new Date(startDate), format: startPrecision, era: this.startEra, calendar: this.calendar };

        let endDate: string;
        let endPrecision: string;

        if (this.endMonth === undefined) {
            // year precision
            endDate = this.endYear.toString();
            endPrecision = 'yyyy';
        } else if (this.endDay === undefined) {
            // month precision
            endDate = this.endYear + this.separator + this.endMonth;
            endPrecision = 'MMMM ' + 'yyyy';
        } else {
            // day precision
            endDate = this.endYear + this.separator + this.endMonth + this.separator + this.endDay;
            endPrecision = 'longDate';
        }

        if (startDate !== endDate) {
            dateObj.end = { date: new Date(endDate), format: endPrecision, era: this.endEra, calendar: this.calendar };
        }

        return dateObj; */
    }

    getClassName(): string {
        return KnoraConstants.ReadDateValue;
    }
}

/**
 * Represents a link value object (reification).
 */
export class ReadLinkValue implements ReadPropertyItem {

    constructor(readonly id: string, readonly propIri, readonly referredResourceIri: string, readonly referredResource?: ReadResource) {

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
}

/**
 * Represents an integer value object.
 */
export class ReadIntegerValue implements ReadPropertyItem {

    constructor(readonly id: string, readonly propIri, readonly integer: number) {

    }

    readonly type = KnoraConstants.IntValue;

    getClassName(): string {
        return KnoraConstants.ReadIntegerValue;
    }

}

/**
 * Represents a decimal value object.
 */
export class ReadDecimalValue implements ReadPropertyItem {

    constructor(readonly id: string, readonly propIri, readonly decimal: number) {

    }

    readonly type = KnoraConstants.DecimalValue;

    getClassName(): string {
        return KnoraConstants.ReadDecimalValue;
    }
}

/**
 * Represents a still image value object.
 */
export class ReadStillImageFileValue implements ReadPropertyItem {

    constructor(
        readonly id: string,
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

    makeIIIFUrl = function (reduceFactor: number): string {

        if (this.isPreview) {
            return this.imagePath;
        } else {
            let percentage = Math.floor(100 / reduceFactor);

            percentage = (percentage > 0 && percentage <= 100) ? percentage : 50;

            return this.imageServerIIIFBaseURL + '/' + this.imageFilename + '/full/pct:' + percentage.toString() + '/0/default.jpg';
        }

    };

    getClassName(): string {
        return KnoraConstants.ReadStillImageFileValue;
    }
}

/**
 * Represents a text representation value object
 */
export class ReadTextFileValue implements ReadPropertyItem {

    constructor(readonly id: string, readonly propIri, readonly textFilename: string, readonly textFileURL: string) {

    }

    readonly type = KnoraConstants.TextFileValue;

    makeUrl = function (): string {
        return `${this.textFileURL}`;
    };

    getClassName(): string {
        return KnoraConstants.TextFileValue;
    }

}

/**
 * Represents a color value object.
 */
export class ReadColorValue implements ReadPropertyItem {

    constructor(readonly id: string,
        readonly propIri,
        readonly colorHex: string) {
    }

    readonly type = KnoraConstants.ColorValue;

    getClassName(): string {
        return KnoraConstants.ReadColorValue;
    }
}

/**
 * Represents a point in a 2D-coordinate system (for geometry values).
 */
export class Point2D {
    constructor(public x: number, public y: number) {
    }
}

/**
 * Represents a geometry value parsed from JSON.
 */
export class RegionGeometry {
    constructor(public status: string,
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

    constructor(readonly id: string, readonly propIri: string, readonly geometryString: string) {

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
}

/**
 * Represents a URI value object.
 */
export class ReadUriValue implements ReadPropertyItem {

    constructor(readonly id: string, readonly propIri: string, readonly uri: string) {

    }

    readonly type = KnoraConstants.UriValue;

    getClassName(): string {
        return KnoraConstants.ReadUriValue;
    }

}

/**
 * Represents a Boolean value object.
 */
export class ReadBooleanValue implements ReadPropertyItem {

    constructor(readonly id: string, readonly propIri: string, readonly bool: boolean) {

    }

    readonly type = KnoraConstants.BooleanValue;

    getClassName(): string {
        return KnoraConstants.ReadBooleanValue;
    }

}

/**
 * Represents an interval value object.
 */
export class ReadIntervalValue implements ReadPropertyItem {

    constructor(readonly id: string, readonly propIri: string, readonly intervalStart: number, readonly intervalEnd: number) {

    }

    readonly type = KnoraConstants.IntervalValue;

    getClassName(): string {
        return KnoraConstants.ReadIntervalValue;
    }

}

/**
 * Represents an interval value object.
 */
export class ReadListValue implements ReadPropertyItem {

    constructor(readonly id: string, readonly propIri: string, readonly listNodeIri: string, readonly listNodeLabel: string, ) {

    }

    readonly type = KnoraConstants.ListValue;

    getClassName(): string {
        return KnoraConstants.ReadListValue;
    }

}

import {Point2D} from './point-2d';

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
    ) {}
}

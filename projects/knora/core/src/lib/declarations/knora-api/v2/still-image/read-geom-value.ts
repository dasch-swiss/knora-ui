import {KnoraConstants} from '../../knora-constants';
import {Point2D} from './point-2d';
import {ReadPropertyItem} from '..';
import {RegionGeometry} from './region-geometry';

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

    getContent(): string {
        return this.geometryString;
    }

    getClassName(): string {
        return KnoraConstants.ReadGeomValue;
    }
}

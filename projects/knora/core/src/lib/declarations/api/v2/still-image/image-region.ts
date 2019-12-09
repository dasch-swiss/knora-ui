import { KnoraConstants } from '../../knora-constants';
import { ReadGeomValue } from '../properties/read-property-item';
import { ReadResource } from '../resources/read-resource';

/**
 * @deprecated Use **Region** instead
 *
 * Represents a region.
 * Contains a reference to the resource representing the region and its geometries.
 */

export class ImageRegion {

    /**
     *
     * @param {ReadResource} regionResource a resource of type Region
     */
    constructor(readonly regionResource: ReadResource) {

    }

    /**
     * Get all geometry information belonging to this region.
     *
     * @returns {ReadGeomValue[]}
     */
    getGeometries() {
        return this.regionResource.properties[KnoraConstants.hasGeometry] as ReadGeomValue[];
    }
}

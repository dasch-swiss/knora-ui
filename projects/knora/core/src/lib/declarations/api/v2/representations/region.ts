import { ReadGeomValue, ReadResource } from '@knora/api';

import { KnoraConstants } from '../../knora-constants';

/**
 * Represents a region.
 * Contains a reference to the resource representing the region and its geometries.
 */

export class Region {

    /**
     *
     * @param {ReadResource} regionResource a resource of type Region
     */
    constructor (readonly regionResource: ReadResource) {

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

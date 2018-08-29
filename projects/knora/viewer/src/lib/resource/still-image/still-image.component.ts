import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChange } from '@angular/core';
import { Point2D, ReadStillImageFileValue, RegionGeometry, StillImageRepresentation } from '@knora/core';

// This component needs the openseadragon library itself, as well as the openseadragon plugin openseadragon-svg-overlay
// Both libraries are installed via package.json, and loaded globally via the script tag in .angular-cli.json

// OpenSeadragon does not export itself as ES6/ECMA2015 module,
// it is loaded globally in scripts tag of angular-cli.json,
// we still need to declare the namespace to make TypeScript compiler happy.
declare let OpenSeadragon: any;

/**
 * Sends a requests to the parent component to load more StillImageRepresentations.
 */
export class RequestStillImageRepresentations {

    /**
     *
     * @param offsetChange the relative change of the offset in order to get more incoming StillImageRepresentations for the resource currently being displayed. Either 1 or -1.
     * @param whenLoadedCB a callback function that is called when more incoming StillImageRepresentations have been requested and the answer arrived from the server.
     */
    constructor(readonly offsetChange: number, readonly whenLoadedCB: (numberOfImages: number) => void) {
    }
}

/**
 * Prepare tile sources from the given sequence of [[ReadStillImageFileValue]].
 *
 * @param imagesToDisplay the given file values to de displayed.
 * @returns the tile sources to be passed to OSD viewer.
 */
/* private static prepareTileSourcesFromFileValues(imagesToDisplay: ReadStillImageFileValue[]): Object[] {
let imageXOffset = 0;
let imageYOffset = 0;
let tileSources = [];

for (let image of imagesToDisplay) {
    let sipiBasePath = image.imageServerIIIFBaseURL + "/" + image.imageFilename;
    let width = image.dimX;
    let height = image.dimY;

    // construct OpenSeadragon tileSources according to https://openseadragon.github.io/docs/OpenSeadragon.Viewer.html#open
    tileSources.push({
        // construct IIIF tileSource configuration according to
        // http://iiif.io/api/image/2.1/#technical-properties
        // see also http://iiif.io/api/image/2.0/#a-implementation-notes
        "tileSource": {
            "@context": "http://iiif.io/api/image/2/context.json",
            "@id": sipiBasePath,
            "height": height,
            "width": width,
            "profile": ["http://iiif.io/api/image/2/level2.json"],
            "protocol": "http://iiif.io/api/image",
            "tiles": [{
                "scaleFactors": [1, 2, 4, 8, 16, 32],
                "width": 1024
            }]
        },
        "x": imageXOffset,
        "y": imageYOffset
    });

    imageXOffset++;

    // 5 images per row
    if (imageXOffset % 5 == 0) {
        imageYOffset += 2;
        imageXOffset = 0;
    }
}

return tileSources;
} */


@Component({
    selector: 'kui-still-image',
    templateUrl: './still-image.component.html',
    styleUrls: ['./still-image.component.scss']
})
export class StillImageComponent implements OnInit, OnChanges, OnDestroy {

    @Input() images: StillImageRepresentation[];
    @Input() imageRangeStart: number;  // index first image of this.images to be displayed
    @Input() imageRangeEnd: number; // index of last image of this.images to be displayed.
    @Input() imageChangeInterval: number; // the size of the interval when displaying more images of this.images

    @Output() getImages = new EventEmitter<RequestStillImageRepresentations>(); // sends a message to the parent component (object.component) to load the next or previous page of results (images) from the server

    private viewer;

    /**
     * Prepare tile sources from the given sequence of [[ReadStillImageFileValue]].
     *
     * @param imagesToDisplay the given file values to de displayed.
     * @returns the tile sources to be passed to OSD viewer.
     */
    private static prepareTileSourcesFromFileValues(imagesToDisplay: ReadStillImageFileValue[]): Object[] {
        let imageXOffset = 0;
        let imageYOffset = 0;
        const tileSources = [];

        for (const image of imagesToDisplay) {
            const sipiBasePath = image.imageServerIIIFBaseURL + '/' + image.imageFilename;
            const width = image.dimX;
            const height = image.dimY;

            // construct OpenSeadragon tileSources according to https://openseadragon.github.io/docs/OpenSeadragon.Viewer.html#open
            tileSources.push({
                // construct IIIF tileSource configuration according to
                // http://iiif.io/api/image/2.1/#technical-properties
                // see also http://iiif.io/api/image/2.0/#a-implementation-notes
                'tileSource': {
                    '@context': 'http://iiif.io/api/image/2/context.json',
                    '@id': sipiBasePath,
                    'height': height,
                    'width': width,
                    'profile': ['http://iiif.io/api/image/2/level2.json'],
                    'protocol': 'http://iiif.io/api/image',
                    'tiles': [{
                        'scaleFactors': [1, 2, 4, 8, 16, 32],
                        'width': 1024
                    }]
                },
                'x': imageXOffset,
                'y': imageYOffset
            });

            imageXOffset++;

            // 5 images per row
            if (imageXOffset % 5 === 0) {
                imageYOffset += 2;
                imageXOffset = 0;
            }
        }

        return tileSources;
    }

    constructor(private elementRef: ElementRef) { }

    ngOnChanges(changes: { [key: string]: SimpleChange }) {
        if (changes['images'] && changes['images'].isFirstChange()) {
            this.setupViewer();
        }
        if (changes['images']) {
            this.openImages();
            this.renderRegions();
        }
    }

    ngOnInit() {
        // initialisation is done on first run of ngOnChanges
    }

    ngOnDestroy() {
        if (this.viewer) {
            this.viewer.destroy();
            this.viewer = undefined;
        }
    }

    /**
     * Renders all ReadStillImageFileValues to be found in [[this.images]].
     * (Although this.images is a Angular Input property, the built-in change detection of Angular does not detect changes in complex objects or arrays, only reassignment of objects/arrays.
     * Use this method if additional ReadStillImageFileValues were added to this.images after creation/assignment of the this.images array.)
     */
    updateImages() {
        if (!this.viewer) {
            this.setupViewer();
        }
        this.openImages();
    }

    /**
     * Get the more images from the server by requesting the previous page of results for the current resource (decrease offset).
     */
    gotoLeft() {

        console.log('gotoLeft');

        // TODO: move left on this.images
        // TODO: if necessary, request more images from the server

        /* if (this.imageRangeStart - this.imageChangeInterval >= 0) {
            // this.images has more images to display
            this.imageRangeStart -= this.imageChangeInterval;
            this.imageRangeEnd -= this.imageChangeInterval;

            this.openImages();
            this.renderRegions();
        } else if (this.imageRangeStart > 0) {
            // fewer remaining images than interval, show remaining images
            this.imageRangeEnd -= this.imageRangeStart;
            this.imageRangeStart = 0;

            this.openImages();
            this.renderRegions();
        }
        {
            // this.images cannot display more images of length interval
            // request more images from the server using a negative offset

            // TODO: implement getting previous offset (also in parent component)
        } */

    }

    /**
     * Get the more images from the server by requesting the next page of results for the current resource (increase offset).
     */
    gotoRight() {

        console.log('gotoRight');

        /* if (this.imageRangeEnd < this.images.length - 1) {
            // this.images has more images to display

            if (this.imageRangeEnd + this.imageChangeInterval < this.images.length) {
                // the whole next interval can be displayed
                console.log(`display next interval`);

                this.imageRangeStart += this.imageChangeInterval;
                this.imageRangeEnd += this.imageChangeInterval;
            } else {
                console.log(`display remaining images`);
                // less than the interval can be displayed just display remaining images
                const remainingDiff = this.images.length - this.imageRangeEnd + 1;

                this.imageRangeStart += remainingDiff;
                this.imageRangeEnd += remainingDiff;

                // TODO: deactivate next button

            }

            this.openImages();
            this.renderRegions();

        } else if (this.images.length % environment.pagingLimit === 0) { // paging always returned full result lists, so there could be more data to fetch
            console.log(`request more images`);
            // this.images cannot display more images of length interval
            // request more images from the server using a positive offset

            // function called when parent component loaded new images
            const callback = (numberOfImages: number) => {

                if (numberOfImages >= this.imageChangeInterval) {
                    // more images were loaded than are actually to be displayed

                    this.imageRangeStart += this.imageChangeInterval;
                    this.imageRangeEnd += this.imageChangeInterval;

                    this.openImages();
                    this.renderRegions();
                } else if (numberOfImages > 0) {
                    // the amount of new images in less than the interval, show everything that can be shown

                    this.imageRangeStart += numberOfImages;
                    this.imageRangeEnd += numberOfImages;

                    this.openImages();
                    this.renderRegions();
                } else {
                    // no new images could be returned, display remaining images (there are fewer than this.imageChangeInterval)
                    const remainingImages: number = this.images.length - 1 - this.imageRangeEnd;

                    this.imageRangeStart += remainingImages;
                    this.imageRangeEnd += remainingImages;

                    // TODO: no new images can be loaded -> deactivate control in GUI (note that perhaps sufficient permissions were missing, so we actually cannot be sure that higher offsets still deliver images)

                    this.openImages();
                    this.renderRegions();

                }


            };

            const msg = new RequestStillImageRepresentations(1, callback);

            this.getImages.emit(msg);

        } else {
            // no more data to fetch
            // TODO: deactivate next button

        } */
    }

    /**
     * Renders all regions to be found in [[this.images]].
     * (Although this.images is a Angular Input property, the built-in change detection of Angular does not detect changes in complex objects or arrays, only reassignment of objects/arrays.
     * Use this method if additional regions were added to the resources.images)
     */
    updateRegions() {
        if (!this.viewer) {
            this.setupViewer();
        }
        this.renderRegions();
    }

    /**
     * Initializes the OpenSeadragon viewer
     */
    private setupViewer(): void {
        const viewerContainer = this.elementRef.nativeElement.getElementsByClassName('osdViewerContainer')[0];
        const osdOptions = {
            element: viewerContainer,
            prefixUrl: 'assets/icons/openseadragon/',
            sequenceMode: false,
            showNavigator: true
        };
        this.viewer = new OpenSeadragon.Viewer(osdOptions);
        this.viewer.addHandler('full-screen', function (args) {
            if (args.fullScreen) {
                viewerContainer.classList.add('fullscreen');
            } else {
                viewerContainer.classList.remove('fullscreen');
            }
        });
        this.viewer.addHandler('resize', function (args) {
            args.eventSource.svgOverlay().resize();
        });

    }

    /**
     * Adds all (non-preview) images in this.images to the viewer.
     * Images are positioned in a horizontal row next to each other.
     */
    private openImages(): void {
        // imageXOffset controls the x coordinate of the left side of each image in the OpenSeadragon viewport coordinate system.
        // The first image has its left side at x = 0, and all images are scaled to have a width of 1 in viewport coordinates.
        // see also: https://openseadragon.github.io/examples/viewport-coordinates/

        const fileValues: ReadStillImageFileValue[] = this.images.map(
            (img) => {
                return img.stillImageFileValue;
            });

        // display only the defined range of this.images
        const tileSources: Object[] = StillImageComponent.prepareTileSourcesFromFileValues(fileValues.slice(this.imageRangeStart, this.imageRangeEnd + 1));

        this.viewer.clearOverlays();
        this.viewer.open(tileSources);
    }

    /**
    * Adds a ROI-overlay to the viewer for every region of every image in this.images
    */
    private renderRegions(): void {
        this.viewer.clearOverlays();

        let imageXOffset = 0; // see documentation in this.openImages() for the usage of imageXOffset

        for (const image of this.images) {
            const aspectRatio = (image.stillImageFileValue.dimY / image.stillImageFileValue.dimX);

            for (const region of image.regions) {

                for (const geometryValue of region.getGeometries()) {
                    const geometry = geometryValue.geometry;
                    this.createSVGOverlay(geometry, aspectRatio, imageXOffset, region.regionResource.label);
                }
            }

            imageXOffset++;
        }

    }

    /**
     * Creates and adds a ROI-overlay to the viewer
     * @param geometry - the geometry describing the ROI
     * @param aspectRatio -  the aspectRatio (h/w) of the image on which the geometry should be placed
     * @param xOffset -  the x-offset in Openseadragon viewport coordinates of the image on which the geometry should be placed
     * @param toolTip -  the tooltip which should be displayed on mousehover of the svg element
     */
    private createSVGOverlay(geometry: RegionGeometry, aspectRatio: number, xOffset: number, toolTip: string): void {
        const lineColor = geometry.lineColor;
        const lineWidth = geometry.lineWidth;

        let svgElement;
        switch (geometry.type) {
            case 'rectangle':
                svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');  // yes, we render rectangles as svg polygon elements
                this.addSVGAttributesRectangle(svgElement, geometry, aspectRatio, xOffset);
                break;
            case 'polygon':
                svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                this.addSVGAttributesPolygon(svgElement, geometry, aspectRatio, xOffset);
                break;
            case 'circle':
                svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                this.addSVGAttributesCircle(svgElement, geometry, aspectRatio, xOffset);
                break;
            default:
                console.log('ERROR: StillImageOSDViewerComponent.createSVGOverlay: unknown geometryType: ' + geometry.type);
                return;
        }
        svgElement.id = 'roi-svgoverlay-' + Math.random() * 10000;
        svgElement.setAttribute('class', 'roi-svgoverlay');
        svgElement.setAttribute('style', 'stroke: ' + lineColor + '; stroke-width: ' + lineWidth + 'px;');

        const svgTitle = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        svgTitle.textContent = toolTip;

        const svgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        svgGroup.appendChild(svgTitle);
        svgGroup.appendChild(svgElement);

        const overlay = this.viewer.svgOverlay();
        overlay.node().appendChild(svgGroup);
    }

    /**
     * Adds the necessary attributes to create a ROI-overlay of type 'rectangle' to a SVGElement
     * @param svgElement - an SVGElement (should have type 'polygon' (sic))
     * @param geometry - the geometry describing the rectangle
     * @param aspectRatio - the aspectRatio (h/w) of the image on which the circle should be placed
     * @param xOffset - the x-offset in Openseadragon viewport coordinates of the image on which the circle should be placed
     */
    private addSVGAttributesRectangle(svgElement: SVGElement, geometry: RegionGeometry, aspectRatio: number, xOffset: number): void {
        const pointA = geometry.points[0];
        const pointB = geometry.points[1];

        // geometry.points contains two diagonally opposed corners of the rectangle, but the order of the corners is arbitrary.
        // We therefore construct the upperleft (UL), lowerright (LR), upperright (UR) and lowerleft (LL) positions of the corners with min and max operations.
        const positionUL = new Point2D(Math.min(pointA.x, pointB.x), Math.min(pointA.y, pointB.y));
        const positionLR = new Point2D(Math.max(pointA.x, pointB.x), Math.max(pointA.y, pointB.y));
        const positionUR = new Point2D(Math.max(pointA.x, pointB.x), Math.min(pointA.y, pointB.y));
        const positionLL = new Point2D(Math.min(pointA.x, pointB.x), Math.max(pointA.y, pointB.y));

        const points = [positionUL, positionUR, positionLR, positionLL];
        const viewCoordPoints = this.image2ViewPortCoords(points, aspectRatio, xOffset);
        const pointsString = this.createSVGPolygonPointsAttribute(viewCoordPoints);
        svgElement.setAttribute('points', pointsString);
    }

    /**
     * Adds the necessary attributes to create a ROI-overlay of type 'polygon' to a SVGElement
     * @param svgElement - an SVGElement (should have type 'polygon')
     * @param geometry - the geometry describing the polygon
     * @param aspectRatio - the aspectRatio (h/w) of the image on which the circle should be placed
     * @param xOffset - the x-offset in Openseadragon viewport coordinates of the image on which the circle should be placed
     */
    private addSVGAttributesPolygon(svgElement: SVGElement, geometry: RegionGeometry, aspectRatio: number, xOffset: number): void {
        const viewCoordPoints = this.image2ViewPortCoords(geometry.points, aspectRatio, xOffset);
        const pointsString = this.createSVGPolygonPointsAttribute(viewCoordPoints);
        svgElement.setAttribute('points', pointsString);
    }

    /**
     * Adds the necessary attributes to create a ROI-overlay of type 'circle' to a SVGElement
     * @param svgElement - an SVGElement (should have type 'circle')
     * @param geometry - the geometry describing the circle
     * @param aspectRatio - the aspectRatio (h/w) of the image on which the circle should be placed
     * @param xOffset - the x-offset in Openseadragon viewport coordinates of the image on which the circle should be placed
     */
    private addSVGAttributesCircle(svgElement: SVGElement, geometry: RegionGeometry, aspectRatio: number, xOffset: number): void {
        const viewCoordPoints = this.image2ViewPortCoords(geometry.points, aspectRatio, xOffset);
        const cx = String(viewCoordPoints[0].x);
        const cy = String(viewCoordPoints[0].y);
        // geometry.radius contains not the radius itself, but the coordinates of a (arbitrary) point on the circle.
        // We therefore have to calculate the length of the vector geometry.radius to get the actual radius. -> sqrt(x^2 + y^2)
        // Since geometry.radius has its y coordinate scaled to the height of the image,
        // we need to multiply it with the aspectRatio to get to the scale used by Openseadragon, analoguous to this.image2ViewPortCoords()
        const radius = String(Math.sqrt(geometry.radius.x * geometry.radius.x + aspectRatio * aspectRatio * geometry.radius.y * geometry.radius.y));
        svgElement.setAttribute('cx', cx);
        svgElement.setAttribute('cy', cy);
        svgElement.setAttribute('r', radius);
    }

    /**
     * Maps a Point2D[] with coordinates relative to an image to a new Point2D[] with coordinates in the viewport coordinate system of Openseadragon
     * see also: https://openseadragon.github.io/examples/viewport-coordinates/
     * @param points - an array of points in coordinate system relative to an image
     * @param aspectRatio - the aspectRatio (h/w) of the image
     * @param xOffset - the x-offset in viewport coordinates of the image
     * @returns - a new Point2D[] with coordinates in the viewport coordinate system of Openseadragon
     */
    private image2ViewPortCoords(points: Point2D[], aspectRatio: number, xOffset: number): Point2D[] {
        return points.map((point) => {
            return new Point2D(point.x + xOffset, point.y * aspectRatio);
        });
    }

    /**
    * Returns a string in the format expected by the 'points' attribute of a SVGElement
    * @param points - an array of points to be serialized to a string
    * @returns - the points serialized to a string in the format expected by the 'points' attribute of a SVGElement
    */
    private createSVGPolygonPointsAttribute(points: Point2D[]): string {
        let pointsString = '';
        for (const i in points) {
            if (points.hasOwnProperty(i)) {
                pointsString += points[i].x;
                pointsString += ',';
                pointsString += points[i].y;
                pointsString += ' ';
            }
        }
        return pointsString;
    }


}

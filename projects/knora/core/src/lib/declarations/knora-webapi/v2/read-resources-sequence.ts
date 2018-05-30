import {ReadResource} from './read-resource';

export class ReadResourcesSequence {

    constructor(resources: Array<ReadResource>, numberOfResources: number) {
        this.resources = resources;

        this.numberOfResources = numberOfResources;

    }

    resources: Array<ReadResource>;

    numberOfResources: number;

}

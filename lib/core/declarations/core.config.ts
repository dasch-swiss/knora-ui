import {JsonObject, JsonProperty} from 'json2typescript';

/**
 * Knora core configuration with the server definitions of:
 *  - api: URL of data service e.g. knora: http://localhost:3333
 *  - media: URL of media server service e.g. sipi: http://localhost:1024
 *  - gui: URL of the app-dep e.g. salsah: http://localhost:4200
 */
@JsonObject
export class KnoraCoreConfig {

    @JsonProperty('api', String)
    public api: string = undefined;

    @JsonProperty('media', String)
    public media: string = undefined;

    @JsonProperty('gui', String)
    public gui: string = undefined;
}


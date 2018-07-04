import {JsonObject, JsonProperty} from 'json2typescript';

/**
 * Knora-ui core configuration with the server definitions of:
 *  - api: URL of data service e.g. knora: http://localhost:3333
 *  - media: URL of media server service e.g. sipi: http://localhost:1024
 *  - app: URL of the app e.g. salsah: http://localhost:4200
 */
@JsonObject
export class KuiCoreConfig {

    /**
     * (Salsah) name of the app
     * @type {string}
     */
    @JsonProperty('name', String)
    public name: string = undefined;

    /**
     * (knora) url of the api
     * @type {string}
     */
    @JsonProperty('api', String)
    public api: string = undefined;

    /**
     * (sipi) url of media/file server
     * @type {string}
     */
    @JsonProperty('media', String)
    public media: string = undefined;

    /**
     * (salsah) url of the app
     * @type {undefined}
     */
    @JsonProperty('app', String)
    public app: string = undefined;
}

import { JsonObject, JsonProperty } from 'json2typescript';

/**
 * @deprecated since v9.5.0 - Use KuiCore instead
 *
 * Knora-ui core configuration with the server definitions of:
 *  - api: URL of data service e.g. knora: http://localhost:3333
 *  - media: URL of media server service e.g. sipi: http://localhost:1024
 *  - app: URL of the app e.g. salsah: http://localhost:4200
 */
@JsonObject('KuiCoreConfig')
export class KuiCoreConfig {

    /**
     * name of the app e.g. 'SALSAH'
     * @type {string}
     */
    @JsonProperty('name', String)
    public name: string = undefined;

    /**
     * url of the app e.g. 'https://salsah.org'
     * @type {undefined}
     */
    @JsonProperty('app', String)
    public app: string = undefined;

    /**
     * url of the api e.g. 'https://api.knora.org'
     * @type {string}
     */
    @JsonProperty('api', String)
    public api: string = undefined;

    /**
     * url of media/file server e.g. 'https://iiif.sipi.io'
     * @type {string}
     */
    @JsonProperty('media', String)
    public media: string = undefined;

    /**
     * url of the ontology e.g. 'http://api.02.unibas.dasch.swiss'
     * @type {string}
     */
    @JsonProperty('ontologyIRI', String)
    public ontologyIRI: string = undefined;

}

import {JsonObject, JsonProperty} from 'json2typescript';

/**
 * Knora-ui core configuration with the server definitions of:
 *  - api: URL of data service e.g. knora: http://localhost:3333
 *  - media: URL of media server service e.g. sipi: http://localhost:1024
 *  - app: URL of the app e.g. salsah: http://localhost:4200
 */
@JsonObject
export class KuiCoreConfig {

    @JsonProperty('api', String)
    public api: string = undefined;

    @JsonProperty('media', String)
    public media: string = undefined;

    @JsonProperty('app', String)
    public app: string = undefined;
}

export class KnoraApiConfig {

    public static KnoraOntologyPath: string = 'http://www.knora.org/ontology';
    public static KnoraBase: string = KnoraApiConfig.KnoraOntologyPath + '/knora-base';

    public static SystemProjectIRI: string = KnoraApiConfig.KnoraBase + '#SystemProject';
    public static SystemAdminGroupIRI: string = KnoraApiConfig.KnoraBase + '#SystemAdmin';
    public static ProjectAdminGroupIRI: string = KnoraApiConfig.KnoraBase + '#ProjectAdmin';
    public static ProjectMemberGroupIRI: string = KnoraApiConfig.KnoraBase + '#ProjectMember';
}

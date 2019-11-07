import { JsonObject, JsonProperty } from 'json2typescript';

/**
 * @deprecated Use new model from @knora/api (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('OntologyInfoShort')
export class OntologyInfoShort {

    @JsonProperty('ontologyIri', String)
    public ontologyIri: string = undefined;

    @JsonProperty('ontologyName', String)
    public ontologyName: string = undefined;

}

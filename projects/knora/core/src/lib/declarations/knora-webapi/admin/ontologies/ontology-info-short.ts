import {JsonObject, JsonProperty} from 'json2typescript';

@JsonObject
export class OntologyInfoShort {

    @JsonProperty('ontologyIri', String)
    public ontologyIri: string = undefined;

    @JsonProperty('ontologyName', String)
    public ontologyName: string = undefined;

}

import {JsonObject, JsonProperty} from 'json2typescript';


@JsonObject
export class Context {

    @JsonProperty('knora-api', String)
    public 'knora-api': string = undefined;

    @JsonProperty('rdfs', String)
    public rdfs: string = undefined;

    @JsonProperty('owl', String)
    public owl: string = undefined;
}

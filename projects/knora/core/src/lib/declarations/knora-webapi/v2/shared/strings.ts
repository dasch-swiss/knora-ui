import {JsonObject, JsonProperty} from 'json2typescript';

@JsonObject
export class StringLiteralV2 {

    @JsonProperty('value', String, false)
    public value: string = undefined;

    @JsonProperty('language', String, true)
    public language: string = '';
}

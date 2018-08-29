import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('StringLiteral')
export class StringLiteral {

    @JsonProperty('value', String, false)
    public value: string = undefined;

    @JsonProperty('language', String, true)
    public language: string = '';
}

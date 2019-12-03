import { JsonObject, JsonProperty } from 'json2typescript';

/**
 * @deprecated since v9.5.0
 *
 * Use new model from `@knora/api` (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('StringLiteral')
export class StringLiteral {

    @JsonProperty('value', String, false)
    public value: string = undefined;

    @JsonProperty('language', String, true)
    public language: string = '';
}

import { JsonObject, JsonProperty } from 'json2typescript';

/**
 * @deprecated Use new model from `@knora/api` (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('LogoutResponse')
export class LogoutResponse {

    @JsonProperty('message', String)
    public message: string = undefined;

    @JsonProperty('status', Number)
    public status: Number = undefined;
}

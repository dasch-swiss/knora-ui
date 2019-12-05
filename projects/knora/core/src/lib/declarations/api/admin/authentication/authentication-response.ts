import { JsonObject, JsonProperty } from 'json2typescript';

/**
 * @deprecated since v9.5.0
 *
 * Use new model from `@knora/api` (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('AuthenticationResponse')
export class AuthenticationResponse {

    @JsonProperty('token', String)
    public token: string = undefined;
}

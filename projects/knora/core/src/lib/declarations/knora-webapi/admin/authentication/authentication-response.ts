import {JsonObject, JsonProperty} from 'json2typescript';

@JsonObject
export class AuthenticationResponse {

    @JsonProperty('token', String)
    public token: string = undefined;
}

import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('LogoutResponse')
export class LogoutResponse {

    @JsonProperty('message', String)
    public message: string = undefined;

    @JsonProperty('status', Number)
    public status: Number = undefined;
}

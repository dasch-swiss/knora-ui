import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject
export class CurrentUser {

    @JsonProperty('email', String)
    public email: string = undefined;

    @JsonProperty('token', String, true)
    public token: string = undefined;

    @JsonProperty('lang', String, true)
    public lang: string = undefined;

    @JsonProperty('sysAdmin', Boolean)
    public sysAdmin: boolean = undefined;

}

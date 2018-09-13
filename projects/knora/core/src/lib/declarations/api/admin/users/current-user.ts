import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject
export class CurrentUser {

    @JsonProperty('name', String)
    public name: string = undefined;

    @JsonProperty('jwt', String, true)
    public jwt: string = undefined;

    @JsonProperty('lang', String, true)
    public lang: string = undefined;

    @JsonProperty('sysAdmin', Boolean)
    public sysAdmin: boolean = undefined;

}

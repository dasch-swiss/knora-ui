import { JsonObject, JsonProperty } from 'json2typescript';
import { CurrentUser } from './current-user';

/*

@JsonObject
export class Session {

    @JsonProperty('id', Number)
    public id: number = undefined;

    @JsonProperty('user', CurrentUser)
    public user: CurrentUser = undefined;

}
*/

export interface Session {
    id: number;
    user: CurrentUser;
}

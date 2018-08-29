import { JsonObject, JsonProperty } from 'json2typescript';
import { User } from './user';

@JsonObject('UserResponse')
export class UserResponse {

    @JsonProperty('user', User)
    public user: User = undefined;
}

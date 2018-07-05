import {JsonObject, JsonProperty} from 'json2typescript';
import {User} from './user';

@JsonObject
export class UserResponse {

    @JsonProperty('user', User)
    public user: User = undefined;
}

import { JsonObject, JsonProperty } from 'json2typescript';
import { User } from './user';

@JsonObject
export class UsersResponse {

    @JsonProperty('users', [User])
    public users: User[] = undefined;

}

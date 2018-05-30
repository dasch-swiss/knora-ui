import {JsonObject, JsonProperty} from 'json2typescript';
import {User} from './user';

@JsonObject
export class UsersList {

    @JsonProperty('users', [User])
    public users: User[] = undefined;

}

@JsonObject
export class NewUserData {

    @JsonProperty('email', String, true)
    public email: string = undefined;

    @JsonProperty('firstname', String, true)
    public givenName: string = undefined;

    @JsonProperty('lastname', String, true)
    public familyName: string = undefined;

    @JsonProperty('user_profile', User, true)
    public user_profile: User = undefined;
}

@JsonObject
export class NewUsersList {
    @JsonProperty('users', [NewUserData])
    public users: NewUserData[] = undefined;
}

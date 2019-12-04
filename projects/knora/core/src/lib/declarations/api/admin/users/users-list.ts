import { JsonObject, JsonProperty } from 'json2typescript';

import { User } from './user';

/**
 * @deprecated since v9.5.0 - Use new model from `@knora/api` (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('UsersList')
export class UsersList {

    @JsonProperty('users', [User])
    public users: User[] = undefined;

}

/**
 * @deprecated since v9.5.0 - Use new model from `@knora/api` (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('NewUserData')
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

/**
 * @deprecated since v9.5.0 - Use new model from `@knora/api` (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('NewUsersList')
export class NewUsersList {
    @JsonProperty('users', [NewUserData])
    public users: NewUserData[] = undefined;
}

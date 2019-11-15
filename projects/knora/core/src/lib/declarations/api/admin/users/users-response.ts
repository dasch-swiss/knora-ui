import { JsonObject, JsonProperty } from 'json2typescript';
import { User } from './user';

/**
 * @deprecated Use UsersResponse from `@knora/api` (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('UsersResponse')
export class UsersResponse {

    @JsonProperty('users', [User])
    public users: User[] = undefined;

}

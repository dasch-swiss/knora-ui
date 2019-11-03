import { JsonObject, JsonProperty } from 'json2typescript';
import { User } from './user';

/**
 * @deprecated Use UserResponse from @knora/api (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('UserResponse')
export class UserResponse {

    @JsonProperty('user', User)
    public user: User = undefined;
}

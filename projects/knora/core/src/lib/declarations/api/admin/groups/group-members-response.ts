import { JsonObject, JsonProperty } from 'json2typescript';

import { User } from '../users/user';

/**
 * @deprecated since v9.5.0
 *
 * Use new model from `@knora/api` (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('GroupMembersResponse')
export class GroupMembersResponse {
    @JsonProperty('members', [User])
    public members: User[] = undefined;
}

import { JsonObject, JsonProperty } from 'json2typescript';

import { Group } from '../groups/group';
import { PermissionData } from '../permissions/permission-data';
import { Project } from '../projects/project';

/**
 * @deprecated since v9.5.0 - Use new model from `@knora/api` (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('User')
export class User {

    @JsonProperty('id', String)
    public id: string = undefined;

    @JsonProperty('email', String)
    public email: string = undefined;

    @JsonProperty('username', String)
    public username: string = undefined;

    @JsonProperty('password', String, true)
    public password: string = undefined;

    @JsonProperty('token', String, true)
    public token: string = undefined;

    @JsonProperty('givenName', String)
    public givenName: string = undefined;

    @JsonProperty('familyName', String)
    public familyName: string = undefined;

    @JsonProperty('status', Boolean)
    public status: boolean = undefined;

    @JsonProperty('lang', String)
    public lang: string = undefined;

    @JsonProperty('groups', [Group])
    public groups: Group[] = undefined;

    @JsonProperty('projects', [Project])
    public projects: Project[] = undefined;

    @JsonProperty('sessionId', String, true)
    public sessionId: string = undefined;

    @JsonProperty('permissions', PermissionData)
    public permissions: PermissionData = undefined;

    @JsonProperty('systemAdmin', Boolean, true)
    public systemAdmin?: boolean = false;

}

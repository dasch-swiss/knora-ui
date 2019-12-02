import { JsonObject, JsonProperty } from 'json2typescript';

/**
 * @deprecated since v9.5.0 - Use new model from `@knora/api` (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('PermissionData')
export class PermissionData {

    @JsonProperty('groupsPerProject', Object)
    public groupsPerProject: any = undefined;

    @JsonProperty('administrativePermissionsPerProject', Object)
    public administrativePermissionsPerProject: any = undefined;
}

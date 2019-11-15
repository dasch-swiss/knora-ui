import { JsonObject, JsonProperty } from 'json2typescript';

/**
 * @deprecated Use new model from `@knora/api` (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('PermissionData')
export class PermissionData {

    @JsonProperty('groupsPerProject', Object)
    public groupsPerProject: any = undefined;

    @JsonProperty('administrativePermissionsPerProject', Object)
    public administrativePermissionsPerProject: any = undefined;
}

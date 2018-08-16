import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('PermissionData')
export class PermissionData {

    @JsonProperty('groupsPerProject', Object)
    public groupsPerProject: any = undefined;

    @JsonProperty('administrativePermissionsPerProject', Object)
    public administrativePermissionsPerProject: any = undefined;
}

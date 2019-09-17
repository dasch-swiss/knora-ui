import { JsonObject, JsonProperty } from 'json2typescript';
import { User } from '../users/user';

@JsonObject('GroupMembersResponse')
export class GroupMembersResponse {
    @JsonProperty('members', [User])
    public members: User[] = undefined;
}

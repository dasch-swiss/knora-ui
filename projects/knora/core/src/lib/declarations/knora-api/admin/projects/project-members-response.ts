import {JsonObject, JsonProperty} from 'json2typescript';
import {User} from '../users/user';

@JsonObject
export class ProjectMembersResponse {
    @JsonProperty('members', [User])
    public members: User[] = undefined;
}

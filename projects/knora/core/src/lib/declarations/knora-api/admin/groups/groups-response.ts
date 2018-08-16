import { JsonObject, JsonProperty } from 'json2typescript';
import { Group } from './group';

@JsonObject('GroupsResponse')
export class GroupsResponse {

    @JsonProperty('groups', [Group])
    public groups: Group[] = undefined;

}

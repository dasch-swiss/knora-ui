import {JsonObject, JsonProperty} from 'json2typescript';
import {Group} from './group';

@JsonObject
export class GroupsResponse {

    @JsonProperty('groups', [Group])
    public groups: Group[] = undefined;

}

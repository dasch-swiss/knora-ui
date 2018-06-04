import {JsonObject, JsonProperty} from 'json2typescript';
import {Group} from './group';

@JsonObject
export class GroupResponse {

    @JsonProperty('group', Group)
    public group: Group = undefined;

}

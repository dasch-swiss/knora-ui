import {JsonObject, JsonProperty} from 'json2typescript';
import {List} from './list';

@JsonObject
export class ListResponse {

    @JsonProperty('list', List, false)
    public list: List = undefined;
}



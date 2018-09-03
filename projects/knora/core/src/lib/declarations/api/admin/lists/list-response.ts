import { JsonObject, JsonProperty } from 'json2typescript';
import { List } from './list';

@JsonObject('ListResponse')
export class ListResponse {

    @JsonProperty('list', List, false)
    public list: List = undefined;
}



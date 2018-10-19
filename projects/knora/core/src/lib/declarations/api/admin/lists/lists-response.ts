import { JsonObject, JsonProperty } from 'json2typescript';
import { ListNodeInfo } from './list-node-info';

@JsonObject('ListsResponse')
export class ListsResponse {

    @JsonProperty('lists', [ListNodeInfo], false)
    public lists: ListNodeInfo[] = undefined;
}



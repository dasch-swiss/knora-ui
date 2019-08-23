import { JsonObject, JsonProperty } from 'json2typescript';
import { ListNode } from './list-node';

@JsonObject('ListsResponse')
export class ListsResponse {

    @JsonProperty('lists', [ListNode], false)
    public lists: ListNode[] = undefined;
}



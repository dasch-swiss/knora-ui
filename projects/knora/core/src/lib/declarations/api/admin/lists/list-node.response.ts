import { JsonObject, JsonProperty } from 'json2typescript';
import { ListNode } from './list-node';

@JsonObject('ListNodeResponse')
export class ListNodeResponse {

    @JsonProperty('nodeinfo', ListNode, false)
    public nodeinfo: ListNode = undefined;
}



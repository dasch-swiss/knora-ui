import { JsonObject, JsonProperty } from 'json2typescript';
import { ListNode } from './list-node';

/**
 * @deprecated You should use ListNodeResponse instead
 */
@JsonObject('ListNodeInfoResponse')
export class ListNodeInfoResponse {

    @JsonProperty('nodeinfo', ListNode, false)
    public nodeinfo: ListNode = undefined;
}



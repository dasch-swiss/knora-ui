import { JsonObject, JsonProperty } from 'json2typescript';
import { ListNode } from './list-node';

/**
 * @deprecated Use new model from @knora/api (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('ListNodeResponse')
export class ListNodeResponse {

    @JsonProperty('nodeinfo', ListNode, false)
    public nodeinfo: ListNode = undefined;
}



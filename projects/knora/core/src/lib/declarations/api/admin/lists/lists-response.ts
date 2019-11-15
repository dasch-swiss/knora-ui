import { JsonObject, JsonProperty } from 'json2typescript';
import { ListNode } from './list-node';

/**
 * @deprecated Use new model from `@knora/api` (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('ListsResponse')
export class ListsResponse {

    @JsonProperty('lists', [ListNode], false)
    public lists: ListNode[] = undefined;
}



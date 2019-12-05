import { JsonObject, JsonProperty } from 'json2typescript';

import { ListInfo } from './list-info';
import { ListNode } from './list-node';

/**
 * @deprecated since v9.5.0
 *
 * Use new model from `@knora/api` (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('List')
export class List {

    @JsonProperty('listinfo', ListInfo, false)
    public listinfo: ListInfo = undefined;

    @JsonProperty('children', [ListNode], false)
    public children: ListNode[] = undefined;
}



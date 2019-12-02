import { JsonObject, JsonProperty } from 'json2typescript';

import { StringLiteral } from '../../shared/strings';

/**
 * @deprecated since v9.5.0 - Use new model from `@knora/api` (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('ListNode')
export class ListNode {
    @JsonProperty('id', String)
    public id: string = undefined;

    @JsonProperty('name', String, true)
    public name: string = undefined;

    @JsonProperty('hasRootNode', String, true)
    public hasRootNode: string = undefined;

    @JsonProperty('labels', [StringLiteral])
    public labels: StringLiteral[] = undefined;

    @JsonProperty('comments', [StringLiteral])
    public comments: StringLiteral[] = undefined;

    @JsonProperty('children', [ListNode], true)
    public children: ListNode[] = undefined;

    @JsonProperty('position', Number, true)
    public position: number = undefined;
}

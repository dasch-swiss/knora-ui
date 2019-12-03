import { JsonObject, JsonProperty } from 'json2typescript';

import { StringLiteral } from '../../shared/strings';

/**
 * @deprecated since v9.5.0
 *
 * You should use ListNode instead
 */
@JsonObject('ListNodeInfo')
export class ListNodeInfo {

    @JsonProperty('id', String)
    public id: string = undefined;

    @JsonProperty('name', String, true)
    public name: string = undefined;

    @JsonProperty('projectIri', String, true)
    public projectIri: string = undefined;

    @JsonProperty('isRootNode', Boolean, true)
    public isRootNode: boolean = undefined;

    @JsonProperty('labels', [StringLiteral])
    public labels: StringLiteral[] = undefined;

    @JsonProperty('comments', [StringLiteral])
    public comments: StringLiteral[] = undefined;
}

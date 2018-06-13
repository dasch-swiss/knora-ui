import {JsonObject, JsonProperty} from 'json2typescript';
import {StringLiteralV2} from '../../v2/index';

@JsonObject
export class ListNodeInfo {

    @JsonProperty('id', String, false)
    public id: string = undefined;

    @JsonProperty('labels', [StringLiteralV2], false)
    public labels: StringLiteralV2[] = undefined;

    @JsonProperty('comments', [StringLiteralV2], false)
    public comments: StringLiteralV2[] = undefined;
}

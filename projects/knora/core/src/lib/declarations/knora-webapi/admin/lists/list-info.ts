import {JsonObject, JsonProperty} from 'json2typescript';
import {StringLiteralV2} from '../../v2/shared/strings';

@JsonObject
export class ListInfo {

    @JsonProperty('id', String, false)
    public id: string = undefined;

    @JsonProperty('projectIri', String, false)
    public projectIri: string = undefined;

    @JsonProperty('labels', [StringLiteralV2], true)
    public labels: StringLiteralV2[] = undefined;

    @JsonProperty('comments', [StringLiteralV2], true)
    public comments: StringLiteralV2[] = undefined;
}

import { JsonObject, JsonProperty } from 'json2typescript';
import { StringLiteral } from '../../shared/strings';

@JsonObject('ListNodeInfo')
export class ListNodeInfo {

    @JsonProperty('id', String, false)
    public id: string = undefined;

    @JsonProperty('labels', [StringLiteral], false)
    public labels: StringLiteral[] = undefined;

    @JsonProperty('comments', [StringLiteral], false)
    public comments: StringLiteral[] = undefined;
}

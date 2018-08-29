import { JsonObject, JsonProperty } from 'json2typescript';
import { StringLiteral } from '../../shared/strings';

@JsonObject('ListInfo')
export class ListInfo {

    @JsonProperty('id', String, false)
    public id: string = undefined;

    @JsonProperty('projectIri', String, false)
    public projectIri: string = undefined;

    @JsonProperty('labels', [StringLiteral], true)
    public labels: StringLiteral[] = undefined;

    @JsonProperty('comments', [StringLiteral], true)
    public comments: StringLiteral[] = undefined;
}

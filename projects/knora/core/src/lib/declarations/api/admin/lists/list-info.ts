import { JsonObject, JsonProperty } from 'json2typescript';
import { StringLiteral } from '../../shared/strings';

/**
 * @deprecated Use new model from `@knora/api` (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('ListInfo')
export class ListInfo {

    @JsonProperty('id', String, false)
    public id: string = undefined;

    @JsonProperty('name', String, true)
    public name: string = undefined;

    @JsonProperty('projectIri', String, true)
    public projectIri: string = undefined;

    @JsonProperty('isRootNode', Boolean, true)
    public isRootNode: boolean = undefined;

    @JsonProperty('labels', [StringLiteral], true)
    public labels: StringLiteral[] = undefined;

    @JsonProperty('comments', [StringLiteral], true)
    public comments: StringLiteral[] = undefined;
}

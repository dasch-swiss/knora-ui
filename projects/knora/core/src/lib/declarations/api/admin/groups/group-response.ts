import { JsonObject, JsonProperty } from 'json2typescript';
import { Group } from './group';

/**
 * @deprecated Use new model from @knora/api (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('GroupResponse')
export class GroupResponse {

    @JsonProperty('group', Group)
    public group: Group = undefined;

}

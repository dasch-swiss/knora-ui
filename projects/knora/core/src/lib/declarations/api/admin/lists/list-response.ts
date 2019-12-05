import { JsonObject, JsonProperty } from 'json2typescript';

import { List } from './list';

/**
 * @deprecated since v9.5.0
 *
 * Use new model from `@knora/api` (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('ListResponse')
export class ListResponse {

    @JsonProperty('list', List, false)
    public list: List = undefined;
}



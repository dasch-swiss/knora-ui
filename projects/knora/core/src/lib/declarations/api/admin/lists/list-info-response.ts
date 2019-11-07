import { JsonObject, JsonProperty } from 'json2typescript';
import { ListInfo } from './list-info';

/**
 * @deprecated Use new model from @knora/api (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('ListInfoResponse')
export class ListInfoResponse {

    @JsonProperty('listinfo', ListInfo, false)
    public listinfo: ListInfo = undefined;
}



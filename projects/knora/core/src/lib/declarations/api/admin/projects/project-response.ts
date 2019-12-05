import { JsonObject, JsonProperty } from 'json2typescript';

import { Project } from './project';

/**
 * @deprecated since v9.5.0
 *
 * Use new model from `@knora/api` (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('ProjectResponse')
export class ProjectResponse {

    @JsonProperty('project', Project)
    public project: Project = undefined;

}

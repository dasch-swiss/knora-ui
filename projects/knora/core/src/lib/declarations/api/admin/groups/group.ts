import { JsonObject, JsonProperty } from 'json2typescript';

import { Project } from '../projects/project';

/**
 * @deprecated since v9.5.0 - Use new model from `@knora/api` (github:dasch-swiss/knora-api-js-lib) instead
 */
@JsonObject('Group')
export class Group {

    @JsonProperty('id', String)
    public id: string = undefined;

    @JsonProperty('name', String)
    public name: string = undefined;

    @JsonProperty('description', String)
    public description: string = undefined;

    @JsonProperty('project', Project, false)
    public project: Project = undefined;

    @JsonProperty('status', Boolean)
    public status: boolean = undefined;

    @JsonProperty('selfjoin', Boolean)
    public selfjoin: boolean = undefined;

}

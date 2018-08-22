import { JsonObject, JsonProperty } from 'json2typescript';
import { Project } from './project';


@JsonObject('ProjectResponse')
export class ProjectResponse {

    @JsonProperty('project', Project)
    public project: Project = undefined;

}

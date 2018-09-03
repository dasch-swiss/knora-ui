import { JsonObject, JsonProperty } from 'json2typescript';
import { Project } from './project';

@JsonObject('ProjectsResponse')
export class ProjectsResponse {

    @JsonProperty('projects', [Project])
    public projects: Project[] = undefined;

}

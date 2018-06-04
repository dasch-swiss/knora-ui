import {JsonObject, JsonProperty} from 'json2typescript';
import {Project} from './project';

@JsonObject
export class ProjectsResponse {

    @JsonProperty('projects', [Project])
    public projects: Project[] = undefined;

}

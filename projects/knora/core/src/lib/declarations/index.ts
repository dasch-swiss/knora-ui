export * from './core.config.depr';
export * from './api-service-result';
export * from './api-service-error';
export * from './utils';


/**
 * Interfaces for constants and operators
 */
export * from './api/knora-constants';

/**
 * Interfaces for shared objects
 */
export * from './api/shared/strings';
export * from './api/shared/date';

/**
 * Interfaces for authentication
 */
export * from './api/admin/authentication/authentication-request-payload';
export * from './api/admin/authentication/authentication-response';
export * from './api/admin/authentication/logout-response';

/**
 * Interfaces for groups
 */
export * from './api/admin/groups/group';
export * from './api/admin/groups/group-response';
export * from './api/admin/groups/groups-response';
export * from './api/admin/groups/group-members-response';

/**
 * Interface for lists
 */
export * from './api/admin/lists/list';
export * from './api/admin/lists/list-info';
export * from './api/admin/lists/list-info-response';
export * from './api/admin/lists/list-node';
export * from './api/admin/lists/list-node-info';
export * from './api/admin/lists/list-node-info-response';
export * from './api/admin/lists/list-node-update-payload';
export * from './api/admin/lists/list-response';
export * from './api/admin/lists/list-node-response';
export * from './api/admin/lists/lists-response';
export * from './api/admin/lists/list-create-payload';
export * from './api/admin/lists/list-info-update-payload';

/**
 * Interface for ontologies
 */
export * from './api/admin/ontologies/ontology-info-short';

/**
 * Interfaces for permissions
 */
export * from './api/admin/permissions/permission-data';

/**
 * Interfaces for projects
 */
export * from './api/admin/projects/project';
export * from './api/admin/projects/project-members-response';
export * from './api/admin/projects/project-response';
export * from './api/admin/projects/projects-response';

/**
 * Interfaces for store
 */
export * from './api/admin/store/rdf-data-object';
export * from './api/admin/store/reset-triplestore-content-response';

/**
 * Interfaces for users
 */

export * from './api/admin/users/users-response';
export * from './api/admin/users/user-response';
export * from './api/admin/users/user';

/**
 * Interfaces for properties
 */
export * from './api/v2/properties/read-properties';
export * from './api/v2/properties/read-property-item';

/**
 * Interfaces for resources
 */
export * from './api/v2/resources/read-resource';
export * from './api/v2/resources/read-resources-sequence';

/**
 * Interface for count query response.
 */
export * from './api/v2/count-query/count-query-result';

/**
 * Interfaces for resources
 */
export * from './api/v2/representations/audio-representation';
export * from './api/v2/representations/fileRepresentation';
export * from './api/v2/representations/moving-image-representation';
export * from './api/v2/representations/still-image-representation';
export * from './api/v2/representations/region';
export * from './api/v2/representations/sequence';

/**
 * Interfaces for ontologies
 */
export * from './api/v2/ontology/new-ontology';

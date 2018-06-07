/*
 * Public API Surface of core
 */

export * from './lib/core.module';
export * from './lib/declarations/';

export * from './lib/services';
// --> there is an issue by export the services from this folder and index.ts
// export * from './lib/services/projects/projects.service';
// export * from './lib/services/users/users.service';

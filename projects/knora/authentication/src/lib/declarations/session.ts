import { CurrentUser } from './current-user';

/**
 * @deprecated since v9.5.0
 * This class has been moved to session.service in knora/core.
 * Update your import path.
 */
export interface Session {
    id: number;
    user: CurrentUser;
}

// TODO: move into session.service
import { CurrentUser } from './current-user';

export interface Session {
    id: number;
    user: CurrentUser;
}

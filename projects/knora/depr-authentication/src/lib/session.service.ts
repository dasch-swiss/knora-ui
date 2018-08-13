import { Injectable } from '@angular/core';
import { CurrentUser, KnoraConstants, Session, User } from '@knora/core';

import * as momentImported from 'moment';

const moment = momentImported;

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    // session id (login timestamp)
    private id: string;

    // current user with email, token, sysAdmin, lang
    private currentUser: CurrentUser;

    public session: Session;

    constructor() {
    }

    set(jwt: string, user: User) {
        let sysAdmin: boolean = false;

        const permissions = user.permissions;
        if (permissions.groupsPerProject[KnoraConstants.SystemProjectIRI]) {
            sysAdmin = permissions.groupsPerProject[KnoraConstants.SystemProjectIRI]
                .indexOf(KnoraConstants.SystemAdminGroupIRI) > -1;
        }

        this.session.user = {
            name: user.email,
            jwt: jwt,
            lang: user.lang,
            sysAdmin: sysAdmin
        };

        // define a session id, which is the timestamp of login
        this.session.id = (moment().add(0, 'second')).valueOf();

        console.log(this.session);
        // store in the localStorage
    }

    get() {

    }

    update() {

    }

    validate() {

    }

    destroy() {

    }


}

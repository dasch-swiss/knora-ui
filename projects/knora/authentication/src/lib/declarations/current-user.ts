/**
 * TODO: move into session.service
 * currently logged-in user
 */
export interface CurrentUser {
    // username
    name: string;

    // json web token
    jwt: string;

    // default language for ui
    lang: string;

    // is system admin?
    sysAdmin: boolean;

    // list of project shortcodes where the user is project admin
    projectAdmin: string[];
}

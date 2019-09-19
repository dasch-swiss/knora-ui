export interface AuthenticationRequestPayload {

    identifier: string;

    password: string;
}

export interface AuthenticationRequestByEmailPayload {

    email: string;

    password: string;
}

export interface AuthenticationRequestByUsernamePayload {

    username: string;

    password: string;
}



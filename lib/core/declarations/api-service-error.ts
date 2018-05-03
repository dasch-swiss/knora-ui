
/**
 * Error class used as API response in ApiService
 */
export class ApiServiceError {

    /**
     * Status number
     */
    status: number = 0;

    /**
     * Status text
     */
    statusText: string = '';

    /**
     * API url
     */
    route: string = '';

}

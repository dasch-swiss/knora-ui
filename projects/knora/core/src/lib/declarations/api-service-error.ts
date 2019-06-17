
/**
 * Error class used as API response in ApiService
 */
export class ApiServiceError {


    /**
     * Header contains the Knora / Server version
     */
    header?: any;

    /**
     * Status number
     */
    status = 0;

    /**
     * Status text
     */
    statusText = '';

    /**
     * API url
     */
    url = '';

    /**
     * Additional error info
     */
    errorInfo = '';

}

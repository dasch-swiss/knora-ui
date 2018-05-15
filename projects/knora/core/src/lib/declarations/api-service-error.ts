
/**
 * Error class used as API response in ApiService
 */
export class ApiServiceError {

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

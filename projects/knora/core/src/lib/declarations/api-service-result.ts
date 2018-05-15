
import {JsonConvert, OperationMode, ValueCheckingMode} from 'json2typescript';

/**
 * Result class used as API url response in ApiService
 */
export class ApiServiceResult {

    private static jsonConvert: JsonConvert = new JsonConvert(OperationMode.ENABLE, ValueCheckingMode.ALLOW_NULL);

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
     * Body as JSON
     */
    body: any;

    /**
     * Gets the result body as instance of classObject.
     * @param classObject
     * @returns {any}
     * @throws
     */
    /*
    getBody(classObject?: { new(): any }): any {
        return ApiServiceResult.jsonConvert.deserializeObject(this.body, classObject);
    }
    */


}

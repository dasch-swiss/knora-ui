
import { JsonConvert, OperationMode, ValueCheckingMode } from 'json2typescript';

/**
 * @deprecated Use ApiResponseData from @knora/api (github:dasch-swiss/knora-api-js-lib) instead
 * Result class used as API url response in ApiService
 */
export class ApiServiceResult {

    private static jsonConvert: JsonConvert = new JsonConvert(OperationMode.ENABLE, ValueCheckingMode.ALLOW_NULL);

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
     * Body as JSON
     */
    body: any;

    /**
     * Gets the result body as instance of classObject.
     * @param classObject
     * @returns {any}
     * @throws
     */

    getBody(classObject?: { new(): any }): any {
        // console.log(this.body);
        return ApiServiceResult.jsonConvert.deserialize(this.body, classObject);
    }


}

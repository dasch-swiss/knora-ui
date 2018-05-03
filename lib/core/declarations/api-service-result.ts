
import {JsonConvert, OperationMode, ValueCheckingMode} from 'json2typescript';

/**
 * Result class used as API url response in ApiService
 */
export class ApiServiceResult {

    private static jsonConvert: JsonConvert = new JsonConvert(OperationMode.ENABLE, ValueCheckingMode.ALLOW_NULL);

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
    url: string = '';

    /**
     * Body as JSON
     */
    body: any;

    /**
     * Gets the result body as instance of classObject.
     * @param classObject
     * @returns {any}
     */
    getBody(classObject?: { new(): any }): any {

        if (!classObject) { return this.body; }
        try {
            return ApiServiceResult.jsonConvert.deserializeObject(this.body, classObject);
        } catch (e) {
            console.log(e);
        }
        return null;
    }

}

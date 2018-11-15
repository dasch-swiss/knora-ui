import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe can be used for "for loops", in the case of an array with non-numeric indexes.
 * It returns the key and the value(s). In the example below the {{item.key}} contains the index value
 * and the {{item.value}} contains the value(s).
 *
 * When the value is an object with name and label, you get them with:
 * {{item.value.name}} and {{item.value.label}}
 *
 *
 * @example
 * <ul>
 *     <li *ngFor="let item of list | key">
 *         {{ item.key }}: {{item.value}}
 *     </li>
 * </ul>
 *
 */
@Pipe({
    name: 'key'
})
export class KeyPipe implements PipeTransform {

    /**
     * @ignore
     */
    transform(value: any, args?: any): any {
        const keys = [];
        for (const key in value) {
            if (value.hasOwnProperty(key)) {
                keys.push({key: key, value: value[key]});
            }
        }
        return keys;
    }
}

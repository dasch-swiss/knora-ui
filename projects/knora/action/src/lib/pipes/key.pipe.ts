import { Pipe, PipeTransform } from '@angular/core';

/**
 * @description
 * This pipe can be used for "for loops", in the case of an array with non-numeric indexes.
 * It returns the key and the value and we have to use it as follow:
 *
 *
 * @example
 * <ul>
 *     <li *ngFor="let item of list | key">
 *         {{ item.key }}: {{item.value}}
 *     </li>
 * </ul>
 *
 * @description
 * {{item.key}} contains the index value;
 *
 * {{item.value}} contains the value(s)
 *
 * When the value is an object with name and label, you get them with:
 * {{item.value.name}} and {{item.value.label}}
 */
@Pipe({
    name: 'key'
})
export class KeyPipe implements PipeTransform {

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

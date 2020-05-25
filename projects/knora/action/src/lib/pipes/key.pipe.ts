import { Pipe, PipeTransform } from '@angular/core';

/**
 * @deprecated
 *
 * Since Angular v6.1.0 a default keyvalue pipe exists. You should use this one instead the kuiKey pipe!
 *
 * This pipe can be used for "for loops", in the case of an array with non-numeric indexes.
 * It returns the key and the value(s). In the example below the {{item.key}} contains the index value
 * and the {{item.value}} contains the value(s).
 *
 * When the value is an object with name and label, you get them with:
 * {{item.value.name}} and {{item.value.label}}
 *
 */
@Pipe({
    name: 'kuiKey'
})
export class KeyPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        const keys = [];
        for (const key in value) {
            if (value.hasOwnProperty(key)) {
                keys.push({ key: key, value: value[key] });
            }
        }
        return keys;
    }
}

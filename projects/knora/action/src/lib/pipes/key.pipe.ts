import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe can be used for "for loops", in the case of an array with non-numeric indexes.
 * It returns the key and the value(s). In the example below the {{item.key}} contains the index value
 * and the {{item.value}} contains the value(s).
 *
 * When the value is an object with name and label, you get them with:
 * {{item.value.name}} and {{item.value.label}}
 *
 * The advantage of this pipe over the default Angular slice pipe is the simplicity of adding additional characters at the end of the shortened string.
 * The same construct with slice looks as follow `{{ (str.length>24)? (str | slice:0:24)+'...':(str) }}`.
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

import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe can be used for "for loops", in the case of an array with non-numeric indexes.
 * it returns the key and the value and we have to use it as follow:
 *
 * *ngFor="let item of list | key"
 *
 * {{item.key}} is the index value;
 *
 * {{item.value}} are the values
 *
 * When the value is an object with name and label, you got them with:
 * {{item.value.name}} resp. {{item.value.label}}
 */

 // TODO: move this pipe to the action module

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

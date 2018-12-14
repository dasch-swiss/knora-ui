import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'kuiReverse'
})
export class ReversePipe implements PipeTransform {

    transform(value: any): any {
        if (value) {
            return value.slice().reverse();
        }
    }

}

import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe can be used to shorten long text by a defined length.
 * In markup:
 * {{ str | kuiTruncate:[20] }}
 * or
 * {{ str | kuiTruncate:[20, '...'] }}
 *
 * The first parameter defines the lenght where to truncate the string.
 * Second optional parameter defines the characters to append to the shortened string. Default is '...'.
 *
 */
@Pipe({
    name: 'kuiTruncate'
})
export class TruncatePipe implements PipeTransform {

    transform(value: string, args: string[]): string {
        const limit = args.length > 0 ? parseInt(args[0], 10) : 20;
        const trail = args.length > 1 ? args[1] : '...';
        return value.length > limit ? value.substring(0, limit) + trail : value;
    }

}

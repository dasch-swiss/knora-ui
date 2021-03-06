import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe can be used to shorten long text by a defined length.
 *
 * In markup:
 *
 * {{ str | kuiTruncate:['24'] }}
 *
 * or
 *
 * {{ str | kuiTruncate:['24', '...'] }}
 *
 *
 * The first parameter defines the length where to truncate the string.
 * Second optional parameter defines the characters to append to the shortened string. Default is '...'.
 *
 * The advantage of this pipe over the default Angular slice pipe is the simplicity of adding additional characters at the end of the shortened string.
 * The same construct with Angular slice pipe looks as follow: `{{ (str.length>24)? (str | slice:0:24)+'...':(str) }}`.
 *
 */
@Pipe({
    name: 'kuiTruncate'
})
export class TruncatePipe implements PipeTransform {

    transform(value: string, args: string[]): string {

        if (!value || value.length === 0) {
            return;
        }

        const limit = args.length > 0 ? parseInt(args[0], 10) : 20;
        const trail = args.length > 1 ? args[1] : '...';
        return value.length > limit ? value.substring(0, limit) + trail : value;
    }

}

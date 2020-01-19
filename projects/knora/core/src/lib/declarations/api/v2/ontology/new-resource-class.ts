import { StringLiteral } from '@knora/api';

export interface NewResourceClass {
    labels: StringLiteral[];
    comments: StringLiteral[];
    subClassOf: string;
}

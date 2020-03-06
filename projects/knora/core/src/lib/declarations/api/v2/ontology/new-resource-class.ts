import { StringLiteral } from '@knora/api';

export interface NewResourceClass {
    name: string;
    labels: StringLiteral[];
    comments: StringLiteral[];
    subClassOf: string;
}

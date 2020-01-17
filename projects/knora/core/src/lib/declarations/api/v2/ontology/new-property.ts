export interface NewProperty {
    label: string;
    comment: string;
    subPropertyOf: string;
    guiElement: string;
    guiOrder: number;
    guiAttributes: string[];
    cardinality: string;
}

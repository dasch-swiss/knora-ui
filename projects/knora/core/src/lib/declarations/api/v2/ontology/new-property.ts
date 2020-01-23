export interface NewProperty {
    label: string;
    comment: string;
    subPropOf: string;
    guiElement: string;
    guiOrder: number;
    guiAttributes: string[];
    cardinality: string;
}

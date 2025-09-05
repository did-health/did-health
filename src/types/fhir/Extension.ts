export interface Extension {
    url: string;
    valueString?: string;
    valueCode?: string;
    valueCoding?: any;
    valueBoolean?: boolean;
    extension?: Extension[];
    contentType?: string;
    data?: string;
}

export interface Column {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
    width?: string | number;
    sortable?: boolean;
    hidden?: boolean;
    [key: string]: any;
}

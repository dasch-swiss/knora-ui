export interface KuiConfig {
    api: {
        protocol: any;
        host: string;
        port: number;
        path?: string;
    };
    app: {
        name: string;
        url: string;
    };
}

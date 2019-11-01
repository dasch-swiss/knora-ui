export interface KnoraUiConfig {
    api: {
        protocol: any;
        host: string;
        port: number;
    };
    app: {
        name: string;
        url: string;
    };
}

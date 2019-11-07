import { KnoraApiConfig } from '@knora/api';

export interface KuiConfig {
    knora: KnoraApiConfig;
    app: {
        name: string;
        url: string;
    };
}

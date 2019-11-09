import { KnoraApiConfig } from '@knora/api';

export interface AppConfig {
    name: string;
    url: string;
}

export class KuiConfig {

    constructor(
        public knora: KnoraApiConfig,
        public app: AppConfig
    ) { }
}

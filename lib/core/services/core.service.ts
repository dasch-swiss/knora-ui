import {Injectable} from '@angular/core';

import {
    KnoraCoreConfig
} from '../declarations';

@Injectable()
export class CoreService {

    private config: KnoraCoreConfig = new KnoraCoreConfig();

    public addConfig(config: KnoraCoreConfig): void {
        this.newConfigVerifyPipeline(config);
        this.config = config;
    }

    public getConfig(): KnoraCoreConfig {
        return this.config;
    }

    private newConfigVerifyPipeline(config: KnoraCoreConfig) {
        // verify the configs here

    }
}

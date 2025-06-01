export interface Config {
  zetaRpcUrl: string;
  projectId: string;
  chainId: number;
  network: string;
}

export class ConfigService {
  private static instance: ConfigService;
  private config: Config | null = null;

  private constructor() {}

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public initialize(config: Config): void {
    this.config = config;
  }

  public getConfig(): Config {
    if (!this.config) {
      throw new Error('Config not initialized');
    }
    return this.config;
  }

  public getZetaRpcUrl(): string {
    return this.getConfig().zetaRpcUrl;
  }

  public getProjectId(): string {
    return this.getConfig().projectId;
  }

  public getChainId(): number {
    return this.getConfig().chainId;
  }

  public getNetwork(): string {
    return this.getConfig().network;
  }
}

export const configService = ConfigService.getInstance();

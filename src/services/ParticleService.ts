import { Particle } from '@particle-network/web3aa';
import { configService } from './configService';

export class ParticleService {
  private static instance: ParticleService;
  private particle: Particle | null = null;

  private constructor() {}

  public static getInstance(): ParticleService {
    if (!ParticleService.instance) {
      ParticleService.instance = new ParticleService();
    }
    return ParticleService.instance;
  }

  public async initialize(): Promise<void> {
    if (!this.particle) {
      const config = {
        projectId: configService.getProjectId(),
        chainId: configService.getChainId(),
        network: configService.getNetwork()
      };

      this.particle = new Particle(config);
    }
  }

  public getParticle(): Particle {
    if (!this.particle) {
      throw new Error('Particle instance not initialized');
    }
    return this.particle;
  }
}

export const particleService = ParticleService.getInstance();

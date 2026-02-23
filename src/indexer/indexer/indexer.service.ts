import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class IndexerService implements OnModuleInit {
  private provider: ethers.JsonRpcProvider;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const rpcUrl = this.configService.get<string>('RPC_URL');
    if (!rpcUrl) {
      throw new Error('RPC_URL not configured');
    }
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    
    try {
      const blockNumber = await this.provider.getBlockNumber();
      console.log(`Connected to blockchain. Current block: ${blockNumber}`);
      this.startBlockListener();
    } catch (error) {
      console.log('Failed to connect to blockchain', error);
    }
  }

  private startBlockListener(): void {
    this.provider.on('block', (blockNumber: number) => {
      console.log(`New block received: ${blockNumber}`);
    });

    this.provider.on('error', (error: Error) => {
      console.log('Provider error:', error);
    });
  }
}

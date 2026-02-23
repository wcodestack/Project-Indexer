import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class IndexerService implements OnModuleInit {
  private provider: ethers.WebSocketProvider;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const rpcUrl = this.configService.get<string>('RPC_URL');
    if (!rpcUrl) {
      throw new Error('RPC_URL not configured');
    }
    this.provider = new ethers.WebSocketProvider(rpcUrl);
    
    try {
      const blockNumber = await this.provider.getBlockNumber();
      console.log(`Connected to blockchain. Current block: ${blockNumber}`);
      this.startBlockListener();
      this.startContractListener();
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

  private startContractListener(): void {
    const transferTopic = ethers.id('Transfer(address,address,uint256)');
    const filter = {
      address: this.configService.get<string>('CONTRACT_ADDRESS'),
      topics: [transferTopic],
    };
    this.provider.on(filter, (log) => {
      console.log('Raw log received:', log);
    });
  }
}

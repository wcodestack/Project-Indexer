import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { CONTRACT_ABI } from './abi/contract.abi';

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
    const iface = new ethers.Interface(CONTRACT_ABI);
    const filter = {
      address: this.configService.get<string>('CONTRACT_ADDRESS'),
    };
    this.provider.on(filter, (log) => {
      try {
        const parsedLog = iface.parseLog(log);
        console.log(
          `Event detected: ${parsedLog.name}`,
          parsedLog.args
        );
      } catch (err) {
        console.log('Unknown log format', log);
      }
    });
  }
}

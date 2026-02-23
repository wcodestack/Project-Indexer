import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { CONTRACT_ABI } from '../contract.abi';

@Injectable()
export class IndexerService implements OnModuleInit {
  private provider: ethers.WebSocketProvider;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const rpcUrl = this.configService.get<string>('RPC_URL');
    const contractAddress = this.configService.get<string>('CONTRACT_ADDRESS');

    if (!rpcUrl) {
      throw new Error('RPC_URL not configured');
    }

    if (!contractAddress) {
      throw new Error('CONTRACT_ADDRESS not configured');
    }

    this.provider = new ethers.WebSocketProvider(rpcUrl);

    try {
      const blockNumber = await this.provider.getBlockNumber();
      console.log(`✅ Connected to blockchain. Current block: ${blockNumber}`);

      this.startBlockListener();
      this.startContractListener(contractAddress);
    } catch (error) {
      console.error('❌ Failed to connect to blockchain', error);
    }
  }

  private startBlockListener(): void {
    this.provider.on('block', (blockNumber: number) => {
      console.log(`📦 New block received: ${blockNumber}`);
    });

    this.provider.on('error', (error: Error) => {
      console.error('⚠️ Provider error:', error);
    });
  }

  private startContractListener(contractAddress: string): void {
    const iface = new ethers.Interface(CONTRACT_ABI);

    const filter = {
      address: contractAddress,
    };

    console.log(`👂 Listening for events on contract: ${contractAddress}`);

    this.provider.on(filter, (log) => {
      try {
        const parsedLog = iface.parseLog(log);

        if (!parsedLog) {
          console.log('Unable to parse log');
          return;
        }

        const formattedArgs: Record<string, string> = {};

        parsedLog.fragment.inputs.forEach((input, index) => {
          formattedArgs[input.name] =
            parsedLog.args[index]?.toString() ?? '';
        });

        console.log({
          event: parsedLog.name,
          args: formattedArgs,
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
        });
      } catch (error) {
        console.error('Error parsing log:', error);
      }
    });
  }
}
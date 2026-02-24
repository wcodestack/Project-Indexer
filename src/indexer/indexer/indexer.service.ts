import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { CONTRACT_ABI } from '../contract.abi';
import { PrismaService } from  'src/database/prisma.service';

@Injectable()
export class IndexerService implements OnModuleInit {
  private provider: ethers.WebSocketProvider;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

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

  private async saveEvent(parsedLog: any, log: any): Promise<void> {
    try {
      const safeArgs = JSON.parse(JSON.stringify(parsedLog.args, (_, value) => typeof value === 'bigint' ? value.toString() : value));
      
      await this.prismaService.event.create({
        data: {
          eventName: parsedLog.name,
          contractAddress: log.address,
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          args: JSON.stringify(safeArgs),
        },
      });
      console.log('📝 Event saved to database');
    } catch (error) {
      console.error('❌ Failed to save event to database:', error);
    }
  }

  private startContractListener(contractAddress: string): void {
    const iface = new ethers.Interface(CONTRACT_ABI);

    const filter = {
      address: contractAddress,
    };

    console.log(`👂 Listening for events on contract: ${contractAddress}`);

    this.provider.on(filter, async (log) => {
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

        await this.saveEvent(parsedLog, log);
      } catch (error) {
        console.error('Error parsing log:', error);
      }
    });
  }
}
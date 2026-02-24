import { Module } from '@nestjs/common';
import { IndexerService } from './indexer/indexer.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [IndexerService]
})
export class IndexerModule {}

import { Module } from '@nestjs/common';
import { TransactionSettingService } from './transaction-setting.service';
import { TransactionSettingController } from './transaction-setting.controller';

@Module({
  providers: [TransactionSettingService],
  controllers: [TransactionSettingController]
})
export class TransactionSettingModule {}

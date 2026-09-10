import { Module } from '@nestjs/common';
import { PurchaseReceivingService } from './purchase-receiving.service';
import { PurchaseReceivingController } from './purchase-receiving.controller';
import { AuditLogModule } from '../../../audit-log/audit-log.module';

@Module({
  imports: [AuditLogModule],
  controllers: [PurchaseReceivingController],
  providers: [PurchaseReceivingService],
})
export class PurchaseReceivingModule {}

import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AuditLogModule } from 'src/audit-log/audit-log.module';

@Module({
  imports: [AuditLogModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}

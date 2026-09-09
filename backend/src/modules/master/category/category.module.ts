import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { AuditLogModule } from 'src/audit-log/audit-log.module';

@Module({
  imports: [AuditLogModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}

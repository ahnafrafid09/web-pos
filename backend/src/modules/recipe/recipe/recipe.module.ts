import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { AuditLogModule } from '../../../audit-log/audit-log.module';

@Module({
  imports: [AuditLogModule],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}

import { Global, Module } from '@nestjs/common';
import { ModuleAccessService } from './module-access/module-access.service';
import { ModuleAccessGuard } from './module-access/module-access.guard';

@Global()
@Module({
  providers: [ModuleAccessService, ModuleAccessGuard],
  exports: [ModuleAccessService, ModuleAccessGuard],
})
export class ModuleAccessModule {}

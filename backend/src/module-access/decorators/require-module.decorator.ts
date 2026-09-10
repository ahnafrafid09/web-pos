import { SetMetadata } from '@nestjs/common';
import { ModuleCode } from '../../generated/prisma/enums';

export const REQUIRED_MODULE_KEY = 'required_module';

export const RequireModule = (module: ModuleCode) =>
  SetMetadata(REQUIRED_MODULE_KEY, module);

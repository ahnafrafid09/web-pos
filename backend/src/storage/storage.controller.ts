import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import {
  StorageService,
  UploadedFile as StorageUploadedFile,
} from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('test')
  @UseInterceptors(FileInterceptor('image'))
  async test(@UploadedFile() file: StorageUploadedFile) {
    return this.storageService.saveProductImage(file, {
      tenantId: 'test-tenant',
      productId: 'test-product',
    });
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';
const sharp = require('sharp');
@Injectable()
export class StorageService {
  private readonly storagePath = path.resolve(process.cwd(), '..', 'storage');

  private readonly productsPath = path.join(this.storagePath, 'products');

  private readonly baseUrl =
    process.env.STORAGE_URL || 'http://localhost:8000/storage';

  async saveProductImage(
    file: Express.Multer.File,
    options: {
      tenantId: string;
      productId: string;
    },
  ) {
    this.validateImage(file);

    const productPath = path.join(
      this.productsPath,
      options.tenantId,
      options.productId,
    );

    await fs.mkdir(productPath, {
      recursive: true,
    });

    const fileName = `${randomUUID()}.webp`;

    const absolutePath = path.join(productPath, fileName);
    const result = await sharp(file.buffer)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: 82,
      })
      .toFile(absolutePath);

    const relativePath = path
      .relative(this.storagePath, absolutePath)
      .replace(/\\/g, '/');

    return {
      fileName,

      filePath: relativePath,

      imageUrl: `${this.baseUrl}/${relativePath}`,

      mimeType: 'image/webp',

      size: result.size,

      width: result.width,

      height: result.height,
    };
  }

  async delete(filePath: string) {
    const absolutePath = path.join(this.storagePath, filePath);

    try {
      await fs.unlink(absolutePath);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  private validateImage(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Gambar wajib diupload');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Format gambar harus JPG, PNG, atau WEBP');
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      throw new BadRequestException('Ukuran gambar maksimal 5MB');
    }
  }
}

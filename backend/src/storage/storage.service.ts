import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as crypto from 'crypto';

// Configure Cloudinary from environment variables
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination?: string;
  filename?: string;
  path?: string;
  buffer: Buffer | string;
}

export interface SavedImage {
  fileName: string;
  filePath: string;
  imageUrl: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
  publicId: string;
}

@Injectable()
export class StorageService {
  private readonly folder = process.env.CLOUDINARY_FOLDER || 'pos_system';

  constructor() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    console.log('Cloudinary:', {
      cloudName,
      apiKey: apiKey ? 'ADA' : 'TIDAK ADA',
      apiSecret: apiSecret ? 'ADA' : 'TIDAK ADA',
    });

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Cloudinary environment variables belum lengkap');
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  async saveProductImage(
    file: UploadedFile,
    options: {
      tenantId: string;
      productId: string;
    },
  ): Promise<SavedImage> {
    this.validateImage(file);

    const buffer =
      typeof file.buffer === 'string' ? Buffer.from(file.buffer) : file.buffer;

    const uniqueId = crypto.randomUUID();

    const publicId = `${this.folder}/products/${options.tenantId}/${options.productId}/${uniqueId}`;

    return new Promise<SavedImage>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            public_id: publicId,
            resource_type: 'image',

            transformation: [
              {
                width: 800,
                height: 800,
                crop: 'limit',
              },
              {
                quality: 'auto:good',
                fetch_format: 'webp',
              },
            ],
          },
          (err, result) => {
            if (err) {
              reject(
                new BadRequestException(
                  `Gagal upload ke Cloudinary: ${err.message}`,
                ),
              );
              return;
            }

            if (!result) {
              reject(new BadRequestException('Upload gagal tanpa error'));
              return;
            }

            resolve({
              fileName: `${uniqueId}.webp`,
              filePath: publicId,
              imageUrl: result.secure_url,
              mimeType: 'image/webp',
              size: result.bytes,
              width: result.width,
              height: result.height,
              publicId: result.public_id,
            });
          },
        )
        .end(buffer);
    });
  }
  async delete(imageUrl: string): Promise<void> {
    try {
      const publicId = this.extractPublicId(imageUrl);
      if (!publicId) {
        return;
      }

      await this.destroyImage(publicId);
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
    }
  }

  /**
   * Get Cloudinary URL with optional transformations
   */
  getImageUrl(
    publicId: string,
    options?: {
      width?: number;
      height?: number;
      format?: string;
      quality?: string;
    },
  ): string {
    return cloudinary.url(publicId, {
      width: options?.width || 800,
      height: options?.height || 800,
      crop: 'limit',
      format: options?.format || 'webp',
      quality: options?.quality || 'auto:good',
    });
  }

  /**
   * Extract Cloudinary public ID from image URL
   */
  extractPublicIdFromUrl(imageUrl: string): string | null {
    if (!imageUrl || !process.env.CLOUDINARY_CLOUD_NAME) {
      return null;
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const cloudNameIndex = imageUrl.indexOf(cloudName);
    if (cloudNameIndex === -1) {
      return null;
    }

    const afterCloudName = imageUrl.substring(
      cloudNameIndex + cloudName.length,
    );

    // Match /image/upload/v<number>/<path>
    const regexPattern = /\/image\/upload\/v\d+?([^\?]+)/;
    const match = afterCloudName.match(regexPattern);

    if (match && match[1]) {
      let publicId = match[1].substring(1);
      // Remove extension
      const lastDotIndex = publicId.lastIndexOf('.');
      if (lastDotIndex > 0) {
        publicId = publicId.substring(0, lastDotIndex);
      }
      return publicId;
    }

    return null;
  }

  private extractPublicId(imageUrl: string): string | null {
    return this.extractPublicIdFromUrl(imageUrl);
  }

  private destroyImage(publicId: string): Promise<void> {
    return new Promise((resolve) => {
      cloudinary.uploader.destroy(publicId, ((err: any, result: any) => {
        if (err) {
          console.error('Cloudinary delete error:', err);
        }
        resolve();
      }) as any);
    });
  }

  private validateImage(file: UploadedFile): void {
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

export interface SaveProductImageOptions {
  tenantId: string;
  productId: string;
}

export interface SavedImage {
  fileName: string;
  filePath: string;
  imageUrl: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
}

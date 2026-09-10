import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseReceivingDto } from './dto/create-purchase-receiving.dto';
import { UpdatePurchaseReceivingDto } from './dto/update-purchase-receiving.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditLogService } from '../../../audit-log/audit-log.service';
import { AuthenticatedUser } from '../../../auth/interfaces/authenticated-user.interface';
import { getTenantId } from '../../../common/utils/tenant.util';
import { randomUUID } from 'crypto';

@Injectable()
export class PurchaseReceivingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(
    currentUser: AuthenticatedUser,
    createPurchaseReceivingDto: CreatePurchaseReceivingDto,
    purchaseId: string,
  ) {
    const tenantId = getTenantId(currentUser);

    return this.prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.findFirst({
        where: {
          id: purchaseId,
          tenantId,
        },
        include: {
          items: {
            include: {
              rawMaterial: true,
              unit: true,
            },
          },
        },
      });

      if (!purchase) {
        throw new NotFoundException('Purchase tidak ditemukan');
      }
    });
  }

  private generateReceivingNumber(purchaseDate: Date): string {
    const date = new Date(purchaseDate);

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, '0');

    const day = String(date.getDate()).padStart(2, '0');

    const random = randomUUID().replace(/-/g, '').substring(0, 6).toUpperCase();

    return `REC-${year}${month}${day}-${random}`;
  }

  // findAll() {
  //   return `This action returns all purchaseReceiving`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} purchaseReceiving`;
  // }

  // update(id: number, updatePurchaseReceivingDto: UpdatePurchaseReceivingDto) {
  //   return `This action updates a #${id} purchaseReceiving`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} purchaseReceiving`;
  // }
}

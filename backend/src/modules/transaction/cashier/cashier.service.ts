import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CheckoutCashierDto } from './dto/checkout-cashier-dto';
// import { UpdateCashierDto } from './dto/update-cashier.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { getTenantId } from 'src/common/utils/tenant.util';
import { ListProductCashierDto } from './dto/list-product-cashier-dto';
import { Prisma, Product } from 'src/generated/prisma/client';

@Injectable()
export class CashierService {
  constructor(private readonly prisma: PrismaService) {}

  async checkout(currentUser: AuthenticatedUser, dto: CheckoutCashierDto) {
    const tenantId = getTenantId(currentUser);

    if (!dto.items?.length) {
      throw new BadRequestException('Minimal harus ada 1 product');
    }

    if (!dto.payments?.length) {
      throw new BadRequestException('Minimal harus ada 1 pembayaran');
    }

    return this.prisma.$transaction(async (trx: any) => {
      /**
       * =====================================================
       * 1. GET TRANSACTION SETTING
       * =====================================================
       */
      const setting = await trx.transactionSetting.findUnique({
        where: {
          tenantId,
        },
      });

      /**
       * =====================================================
       * 2. GET PRODUCTS
       * =====================================================
       */
      const productIds = dto.items.map((item) => item.productId);

      const products = await trx.product.findMany({
        where: {
          id: {
            in: productIds,
          },
          tenantId,
          status: true,
        },
      });

      if (products.length !== new Set(productIds).size) {
        throw new NotFoundException('Beberapa product tidak ditemukan');
      }

      /**
       * =====================================================
       * 3. HITUNG SUBTOTAL + HPP
       * =====================================================
       */
      let subtotal = 0;
      let totalHpp = 0;

      const transactionItems = [];

      for (const item of dto.items) {
        const product = products.find(
          (product: any) => product.id === item.productId,
        );

        if (!product) {
          throw new NotFoundException(
            `Product ${item.productId} tidak ditemukan`,
          );
        }

        const quantity = Number(item.quantity);

        if (quantity <= 0) {
          throw new BadRequestException(
            `Quantity product ${product.name} harus lebih dari 0`,
          );
        }

        const sellingPrice = Number(product.sellingPrice);
        const hpp = Number(product.hpp);

        const itemSubtotal = sellingPrice * quantity;
        const itemHpp = hpp * quantity;
        const itemProfit = itemSubtotal - itemHpp;

        subtotal += itemSubtotal;
        totalHpp += itemHpp;

        transactionItems.push({
          productId: product.id,
          productName: product.name,

          quantity,

          // Snapshot harga jual
          sellingPrice,

          // Snapshot HPP
          hpp,
          subtotal: Math.round(itemSubtotal),
          profit: Math.round(itemProfit),
        });
      }

      const discount = Number(dto.discount ?? 0);

      if (discount < 0) {
        throw new BadRequestException('Discount tidak boleh kurang dari 0');
      }

      if (discount > subtotal) {
        throw new BadRequestException(
          'Discount tidak boleh lebih besar dari subtotal',
        );
      }

      const afterDiscount = subtotal - discount;

      /**
       * =====================================================
       * 5. SERVICE CHARGE
       * =====================================================
       */
      let serviceCharge = 0;

      if (setting?.serviceChargeEnabled) {
        serviceCharge = Math.round(
          afterDiscount * (Number(setting.serviceChargeRate) / 100),
        );
      }

      /**
       * =====================================================
       * 6. TAX
       * =====================================================
       */
      let tax = 0;

      if (setting?.taxEnabled) {
        const taxBase = afterDiscount + serviceCharge;

        tax = Math.round(taxBase * (Number(setting.taxRate) / 100));
      }

      /**
       * =====================================================
       * 7. TOTAL
       * =====================================================
       */
      const total = afterDiscount + serviceCharge + tax;

      /**
       * =====================================================
       * 8. PAYMENT METHOD
       * =====================================================
       */
      const paymentMethodIds = dto.payments.map(
        (payment) => payment.paymentMethodId,
      );

      const paymentMethods = await trx.paymentMethod.findMany({
        where: {
          id: {
            in: paymentMethodIds,
          },
          tenantId,
          status: true,
        },
      });

      if (paymentMethods.length !== new Set(paymentMethodIds).size) {
        throw new BadRequestException('Payment method tidak valid');
      }
      const totalPaid = dto.payments.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0,
      );

      if (totalPaid < total) {
        throw new BadRequestException(
          `Pembayaran kurang. Total yang harus dibayar Rp${Math.round(
            total,
          ).toLocaleString('id-ID')}`,
        );
      }

      const change = totalPaid - total;

      const totalHppRounded = Math.round(totalHpp);
      const profit = Math.round(total - totalHppRounded);

      const invoiceNumber = await this.generateInvoiceNumber(trx, tenantId);

      const transaction = await trx.transaction.create({
        data: {
          tenantId,
          invoiceNumber,

          status: 'COMPLETED',

          subtotal: Math.round(subtotal),

          discount: Math.round(discount),

          serviceCharge,

          tax,

          total: Math.round(total),

          totalPaid: Math.round(totalPaid),

          change: Math.round(change),

          totalHpp: totalHppRounded,

          profit,

          items: {
            create: transactionItems,
          },

          payments: {
            create: dto.payments.map((payment) => ({
              paymentMethodId: payment.paymentMethodId,
              amount: Math.round(Number(payment.amount)),
            })),
          },
        },

        include: {
          items: true,

          payments: {
            include: {
              paymentMethod: true,
            },
          },

          cashier: {
            select: {
              id: true,
              name: true,
            },
          },

          tenant: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return {
        message: 'Pembayaran berhasil',
        data: {
          id: transaction.id,
          invoiceNumber: transaction.invoiceNumber,
          createdAt: transaction.createdAt,

          cashier: {
            name: transaction.cashier?.name ?? 'Kasir',
          },

          store: {
            name: transaction.tenant?.name ?? 'Warteg POS',
          },

          items: transaction.items.map((item: any) => ({
            productId: item.productId,
            name: item.productName,
            quantity: Number(item.quantity),
            price: Number(item.sellingPrice),
            subtotal: Number(item.subtotal),
          })),

          subtotal: Number(transaction.subtotal),
          discount: Number(transaction.discount),
          serviceCharge: Number(transaction.serviceCharge),
          tax: Number(transaction.tax),

          total: Number(transaction.total),
          totalPaid: Number(transaction.totalPaid),
          change: Number(transaction.change),

          payments: transaction.payments.map((payment: any) => ({
            paymentMethodId: payment.paymentMethodId,
            paymentMethodName: payment.paymentMethod.name,
            amount: Number(payment.amount),
          })),
        },
      };
    });
  }

  async listProduct(
    currentUser: AuthenticatedUser,
    query: ListProductCashierDto,
  ) {
    const tenantId = getTenantId(currentUser);

    const { page = 1, limit = 10, search, categoryId } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      tenantId,
      status: true,
      category: {
        status: true,
      },
    };

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
          },
        },
        {
          sku: {
            contains: search,
          },
        },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          category: true,
        },
      }),

      this.prisma.product.count({
        where,
      }),
    ]);

    return {
      data: products.map((product) => this.toResponse(product)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async generateInvoiceNumber(
    trx: any,
    tenantId: string,
  ): Promise<string> {
    const today = new Date();

    const date = today.toISOString().slice(0, 10).replace(/-/g, '');

    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );

    const count = await trx.transaction.count({
      where: {
        tenantId,

        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    const sequence = String(count + 1).padStart(4, '0');

    return `TRX-${date}-${sequence}`;
  }

  private toResponse(
    product: Product & {
      category?: {
        name: string;
      } | null;
    },
  ) {
    return {
      id: product.id,
      tenantId: product.tenantId,

      categoryId: product.categoryId,

      name: product.name,
      type: product.type,
      sku: product.sku,
      unit: product.unit,

      sellingPrice: product.sellingPrice,
      hpp: product.hpp,

      status: product.status,

      imageUrl: product.imageUrl,

      category: product.category
        ? {
            name: product.category.name,
          }
        : null,

      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}

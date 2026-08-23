import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SuperadminModule } from './superadmin/superadmin.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { RawMaterialModule } from './raw-material/raw-material.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { SupplierModule } from './supplier/supplier.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    AuthModule,
    UsersModule,
    SuperadminModule,
    CategoryModule,
    ProductModule,
    RawMaterialModule,
    PaymentMethodModule,
    AuditLogModule,
    SupplierModule,
  ],
})
export class AppModule {}

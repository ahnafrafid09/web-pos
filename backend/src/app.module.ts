import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/master/users/users.module';
import { SuperadminModule } from './superadmin/superadmin.module';
import { CategoryModule } from './modules/master/category/category.module';
import { ProductModule } from './modules/master/product/product.module';
import { RawMaterialModule } from './modules/master/raw-material/raw-material.module';
import { PaymentMethodModule } from './modules/master/payment-method/payment-method.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { SupplierModule } from './modules/master/supplier/supplier.module';
import { RecipeModule } from './modules/recipe/recipe/recipe.module';
import { PurchaseModule } from './modules/purchase/purchase/purchase.module';
import { PurchaseReceivingModule } from './modules/purchase/purchase-receiving/purchase-receiving.module';
import { StorageModule } from './storage/storage.module';
import { UnitModule } from './modules/master/unit/unit.module';
import { ModuleAccessModule } from './module-access/module-access.module';
import { TransactionSettingModule } from './modules/transaction/setting/transaction-setting.module';
import { CashierModule } from './modules/transaction/cashier/cashier.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), '..', 'storage'),
      serveRoot: '/storage',
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
    RecipeModule,
    PurchaseModule,
    PurchaseReceivingModule,
    StorageModule,
    UnitModule,
    ModuleAccessModule,
    CashierModule,
    TransactionSettingModule,
  ],
})
export class AppModule {}

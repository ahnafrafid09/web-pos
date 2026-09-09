import { PartialType } from '@nestjs/swagger';
import { CreatePurchaseReceivingDto } from './create-purchase-receiving.dto';

export class UpdatePurchaseReceivingDto extends PartialType(CreatePurchaseReceivingDto) {}

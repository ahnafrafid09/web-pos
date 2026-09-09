import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PurchaseReceivingService } from './purchase-receiving.service';
import { CreatePurchaseReceivingDto } from './dto/create-purchase-receiving.dto';
import { UpdatePurchaseReceivingDto } from './dto/update-purchase-receiving.dto';

@Controller('purchase-receiving')
export class PurchaseReceivingController {
  constructor(
    private readonly purchaseReceivingService: PurchaseReceivingService,
  ) {}

  // @Post()
  // create(@Body() createPurchaseReceivingDto: CreatePurchaseReceivingDto) {
  //   return this.purchaseReceivingService.create(createPurchaseReceivingDto);
  // }

  // @Get()
  // findAll() {
  //   return this.purchaseReceivingService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.purchaseReceivingService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePurchaseReceivingDto: UpdatePurchaseReceivingDto) {
  //   return this.purchaseReceivingService.update(+id, updatePurchaseReceivingDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.purchaseReceivingService.remove(+id);
  // }
}

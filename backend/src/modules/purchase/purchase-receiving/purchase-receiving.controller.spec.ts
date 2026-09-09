import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseReceivingController } from './purchase-receiving.controller';
import { PurchaseReceivingService } from './purchase-receiving.service';

describe('PurchaseReceivingController', () => {
  let controller: PurchaseReceivingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseReceivingController],
      providers: [PurchaseReceivingService],
    }).compile();

    controller = module.get<PurchaseReceivingController>(PurchaseReceivingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseReceivingService } from './purchase-receiving.service';

describe('PurchaseReceivingService', () => {
  let service: PurchaseReceivingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseReceivingService],
    }).compile();

    service = module.get<PurchaseReceivingService>(PurchaseReceivingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

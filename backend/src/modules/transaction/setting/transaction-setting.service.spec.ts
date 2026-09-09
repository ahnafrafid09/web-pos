import { Test, TestingModule } from '@nestjs/testing';
import { TransactionSettingService } from './transaction-setting.service';

describe('TransactionSettingService', () => {
  let service: TransactionSettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionSettingService],
    }).compile();

    service = module.get<TransactionSettingService>(TransactionSettingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

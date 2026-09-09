import { Test, TestingModule } from '@nestjs/testing';
import { TransactionSettingController } from './transaction-setting.controller';

describe('TransactionSettingController', () => {
  let controller: TransactionSettingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionSettingController],
    }).compile();

    controller = module.get<TransactionSettingController>(TransactionSettingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

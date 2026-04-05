import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

const mockService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const req = { user: { authId: 'auth-id-1' } };
const account = { id: 'acc-1', name: 'Cash', accountType: 'cash', balance: 100 };

describe('AccountsController', () => {
  let controller: AccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [{ provide: AccountsService, useValue: mockService }],
    }).compile();

    controller = module.get(AccountsController);
    jest.clearAllMocks();
  });

  it('GET /accounts — returns list for user', async () => {
    mockService.findAll.mockResolvedValue([account]);
    const result = await controller.findAll(req as any, undefined, undefined);
    expect(mockService.findAll).toHaveBeenCalledWith('auth-id-1', undefined, undefined);
    expect(result).toEqual([account]);
  });

  it('GET /accounts — filters by isArchived and accountType', async () => {
    mockService.findAll.mockResolvedValue([]);
    await controller.findAll(req as any, 'true', 'bank');
    expect(mockService.findAll).toHaveBeenCalledWith('auth-id-1', 'true', 'bank');
  });

  it('GET /accounts/:id — returns account', async () => {
    mockService.findOne.mockResolvedValue(account);
    const result = await controller.findOne('acc-1', req as any);
    expect(mockService.findOne).toHaveBeenCalledWith('acc-1', 'auth-id-1');
    expect(result).toBe(account);
  });

  it('GET /accounts/:id — propagates NotFoundException', async () => {
    mockService.findOne.mockRejectedValue(new NotFoundException());
    await expect(controller.findOne('bad-id', req as any)).rejects.toThrow(NotFoundException);
  });

  it('POST /accounts — creates account', async () => {
    mockService.create.mockResolvedValue(account);
    const dto = { name: 'Cash', accountType: 'cash', balance: 100 } as any;
    const result = await controller.create(req as any, dto);
    expect(mockService.create).toHaveBeenCalledWith('auth-id-1', dto);
    expect(result).toBe(account);
  });

  it('PATCH /accounts/:id — updates account', async () => {
    const updated = { ...account, name: 'Updated' };
    mockService.update.mockResolvedValue(updated);
    const dto = { name: 'Updated' } as any;
    const result = await controller.update('acc-1', dto, req as any);
    expect(mockService.update).toHaveBeenCalledWith('acc-1', dto, 'auth-id-1');
    expect(result).toBe(updated);
  });

  it('DELETE /accounts/:id — removes account', async () => {
    mockService.remove.mockResolvedValue({ deleted: true });
    const result = await controller.remove('acc-1', req as any);
    expect(mockService.remove).toHaveBeenCalledWith('acc-1', 'auth-id-1');
    expect(result).toEqual({ deleted: true });
  });
});

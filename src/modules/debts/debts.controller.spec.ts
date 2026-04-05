import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DebtsController } from './debts.controller';
import { DebtsService } from './debts.service';

const mockService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  settle: jest.fn(),
};

const req = { user: { authId: 'auth-id-1' } };
const debt = { id: 'debt-1', personName: 'Alice', type: 'lending', originalAmount: 1000 };

describe('DebtsController', () => {
  let controller: DebtsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DebtsController],
      providers: [{ provide: DebtsService, useValue: mockService }],
    }).compile();

    controller = module.get(DebtsController);
    jest.clearAllMocks();
  });

  it('GET /debts — returns list', async () => {
    mockService.findAll.mockResolvedValue([debt]);
    const result = await controller.findAll(req as any, undefined, undefined);
    expect(mockService.findAll).toHaveBeenCalledWith('auth-id-1', undefined, undefined);
    expect(result).toEqual([debt]);
  });

  it('GET /debts — filters by type and status', async () => {
    mockService.findAll.mockResolvedValue([]);
    await controller.findAll(req as any, 'lending', 'active');
    expect(mockService.findAll).toHaveBeenCalledWith('auth-id-1', 'lending', 'active');
  });

  it('GET /debts/:id — returns debt', async () => {
    mockService.findOne.mockResolvedValue(debt);
    const result = await controller.findOne('debt-1', req as any);
    expect(mockService.findOne).toHaveBeenCalledWith('debt-1', 'auth-id-1');
    expect(result).toBe(debt);
  });

  it('GET /debts/:id — propagates NotFoundException', async () => {
    mockService.findOne.mockRejectedValue(new NotFoundException());
    await expect(controller.findOne('bad-id', req as any)).rejects.toThrow(NotFoundException);
  });

  it('POST /debts — creates debt', async () => {
    mockService.create.mockResolvedValue(debt);
    const dto = { personName: 'Alice', type: 'lending', originalAmount: 1000, remainingAmount: 1000, startDate: '2025-01-01' } as any;
    const result = await controller.create(req as any, dto);
    expect(mockService.create).toHaveBeenCalledWith('auth-id-1', dto);
    expect(result).toBe(debt);
  });

  it('PATCH /debts/:id — updates debt', async () => {
    const updated = { ...debt, remainingAmount: 500 };
    mockService.update.mockResolvedValue(updated);
    const dto = { remainingAmount: 500 } as any;
    const result = await controller.update('debt-1', dto, req as any);
    expect(mockService.update).toHaveBeenCalledWith('debt-1', dto, 'auth-id-1');
    expect(result).toBe(updated);
  });

  it('DELETE /debts/:id — removes debt', async () => {
    mockService.remove.mockResolvedValue({ deleted: true });
    await controller.remove('debt-1', req as any);
    expect(mockService.remove).toHaveBeenCalledWith('debt-1', 'auth-id-1');
  });

  it('POST /debts/:id/settle — settles debt', async () => {
    const settled = { ...debt, status: 'settled' };
    mockService.settle.mockResolvedValue(settled);
    const result = await controller.settle('debt-1', req as any);
    expect(mockService.settle).toHaveBeenCalledWith('debt-1', 'auth-id-1');
    expect(result).toBe(settled);
  });
});

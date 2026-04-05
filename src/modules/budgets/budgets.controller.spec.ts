import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';

const mockService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  addCategory: jest.fn(),
  updateCategory: jest.fn(),
  removeCategory: jest.fn(),
  close: jest.fn(),
};

const req = { user: { authId: 'auth-id-1' } };
const budget = { id: 'bud-1', title: 'January', month: '2025-01', budgetType: 'expense' };

describe('BudgetsController', () => {
  let controller: BudgetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetsController],
      providers: [{ provide: BudgetsService, useValue: mockService }],
    }).compile();

    controller = module.get(BudgetsController);
    jest.clearAllMocks();
  });

  it('GET /budgets — returns list', async () => {
    mockService.findAll.mockResolvedValue([budget]);
    const result = await controller.findAll(req as any, undefined, undefined, undefined);
    expect(mockService.findAll).toHaveBeenCalledWith('auth-id-1', undefined, undefined, undefined);
    expect(result).toEqual([budget]);
  });

  it('GET /budgets — filters by month, status, budgetType', async () => {
    mockService.findAll.mockResolvedValue([]);
    await controller.findAll(req as any, '2025-01', 'active', 'expense');
    expect(mockService.findAll).toHaveBeenCalledWith('auth-id-1', '2025-01', 'active', 'expense');
  });

  it('GET /budgets/:id — returns budget', async () => {
    mockService.findOne.mockResolvedValue(budget);
    const result = await controller.findOne('bud-1', req as any);
    expect(mockService.findOne).toHaveBeenCalledWith('bud-1', 'auth-id-1');
    expect(result).toBe(budget);
  });

  it('GET /budgets/:id — propagates NotFoundException', async () => {
    mockService.findOne.mockRejectedValue(new NotFoundException());
    await expect(controller.findOne('bad-id', req as any)).rejects.toThrow(NotFoundException);
  });

  it('POST /budgets — creates budget', async () => {
    mockService.create.mockResolvedValue(budget);
    const dto = { title: 'January', month: '2025-01', budgetType: 'expense', periodType: 'monthly' } as any;
    const result = await controller.create(req as any, dto);
    expect(mockService.create).toHaveBeenCalledWith('auth-id-1', dto);
    expect(result).toBe(budget);
  });

  it('PATCH /budgets/:id — updates budget', async () => {
    const updated = { ...budget, title: 'Updated' };
    mockService.update.mockResolvedValue(updated);
    const dto = { title: 'Updated' } as any;
    const result = await controller.update('bud-1', dto, req as any);
    expect(mockService.update).toHaveBeenCalledWith('bud-1', dto, 'auth-id-1');
    expect(result).toBe(updated);
  });

  it('DELETE /budgets/:id — removes budget', async () => {
    mockService.remove.mockResolvedValue({ deleted: true });
    await controller.remove('bud-1', req as any);
    expect(mockService.remove).toHaveBeenCalledWith('bud-1', 'auth-id-1');
  });

  it('POST /budgets/:id/categories — adds category', async () => {
    mockService.addCategory.mockResolvedValue(budget);
    const dto = { financeCategoryId: 'cat-1', targetAmount: 500 } as any;
    const result = await controller.addCategory('bud-1', dto, req as any);
    expect(mockService.addCategory).toHaveBeenCalledWith('bud-1', dto, 'auth-id-1');
    expect(result).toBe(budget);
  });

  it('PATCH /budgets/:id/categories/:categoryId — updates category', async () => {
    mockService.updateCategory.mockResolvedValue(budget);
    const dto = { targetAmount: 600 } as any;
    const result = await controller.updateCategory('bud-1', 'cat-1', dto, req as any);
    expect(mockService.updateCategory).toHaveBeenCalledWith('bud-1', 'cat-1', dto, 'auth-id-1');
    expect(result).toBe(budget);
  });

  it('DELETE /budgets/:id/categories/:categoryId — removes category', async () => {
    mockService.removeCategory.mockResolvedValue(budget);
    const result = await controller.removeCategory('bud-1', 'cat-1', req as any);
    expect(mockService.removeCategory).toHaveBeenCalledWith('bud-1', 'cat-1', 'auth-id-1');
    expect(result).toBe(budget);
  });

  it('POST /budgets/:id/close — closes budget', async () => {
    const closed = { ...budget, status: 'closed' };
    mockService.close.mockResolvedValue(closed);
    const result = await controller.close('bud-1', req as any);
    expect(mockService.close).toHaveBeenCalledWith('bud-1', 'auth-id-1');
    expect(result).toBe(closed);
  });
});

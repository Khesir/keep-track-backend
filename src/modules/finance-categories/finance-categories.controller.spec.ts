import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FinanceCategoriesController } from './finance-categories.controller';
import { FinanceCategoriesService } from './finance-categories.service';

const mockService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const req = { user: { authId: 'auth-id-1' } };
const category = { id: 'cat-1', name: 'Food', type: 'expense' };

describe('FinanceCategoriesController', () => {
  let controller: FinanceCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinanceCategoriesController],
      providers: [{ provide: FinanceCategoriesService, useValue: mockService }],
    }).compile();

    controller = module.get(FinanceCategoriesController);
    jest.clearAllMocks();
  });

  it('GET /finance-categories — returns list', async () => {
    mockService.findAll.mockResolvedValue([category]);
    const result = await controller.findAll(req as any, undefined, undefined);
    expect(mockService.findAll).toHaveBeenCalledWith('auth-id-1', undefined, undefined);
    expect(result).toEqual([category]);
  });

  it('GET /finance-categories — filters by type and isArchive', async () => {
    mockService.findAll.mockResolvedValue([]);
    await controller.findAll(req as any, 'expense', 'false');
    expect(mockService.findAll).toHaveBeenCalledWith('auth-id-1', 'expense', 'false');
  });

  it('GET /finance-categories/:id — returns category', async () => {
    mockService.findOne.mockResolvedValue(category);
    const result = await controller.findOne('cat-1', req as any);
    expect(mockService.findOne).toHaveBeenCalledWith('cat-1', 'auth-id-1');
    expect(result).toBe(category);
  });

  it('GET /finance-categories/:id — propagates NotFoundException', async () => {
    mockService.findOne.mockRejectedValue(new NotFoundException());
    await expect(controller.findOne('bad-id', req as any)).rejects.toThrow(NotFoundException);
  });

  it('POST /finance-categories — creates category', async () => {
    mockService.create.mockResolvedValue(category);
    const dto = { name: 'Food', type: 'expense' } as any;
    const result = await controller.create(req as any, dto);
    expect(mockService.create).toHaveBeenCalledWith('auth-id-1', dto);
    expect(result).toBe(category);
  });

  it('PATCH /finance-categories/:id — updates category', async () => {
    const updated = { ...category, name: 'Groceries' };
    mockService.update.mockResolvedValue(updated);
    const dto = { name: 'Groceries' } as any;
    const result = await controller.update('cat-1', dto, req as any);
    expect(mockService.update).toHaveBeenCalledWith('cat-1', dto, 'auth-id-1');
    expect(result).toBe(updated);
  });

  it('DELETE /finance-categories/:id — removes category', async () => {
    mockService.remove.mockResolvedValue({ deleted: true });
    const result = await controller.remove('cat-1', req as any);
    expect(mockService.remove).toHaveBeenCalledWith('cat-1', 'auth-id-1');
    expect(result).toEqual({ deleted: true });
  });
});

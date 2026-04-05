import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';

const mockService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  complete: jest.fn(),
};

const req = { user: { authId: 'auth-id-1' } };
const goal = { id: 'goal-1', name: 'Emergency Fund', targetAmount: 5000, currentAmount: 1000 };

describe('GoalsController', () => {
  let controller: GoalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoalsController],
      providers: [{ provide: GoalsService, useValue: mockService }],
    }).compile();

    controller = module.get(GoalsController);
    jest.clearAllMocks();
  });

  it('GET /goals — returns list', async () => {
    mockService.findAll.mockResolvedValue([goal]);
    const result = await controller.findAll(req as any, undefined);
    expect(mockService.findAll).toHaveBeenCalledWith('auth-id-1', undefined);
    expect(result).toEqual([goal]);
  });

  it('GET /goals — filters by status', async () => {
    mockService.findAll.mockResolvedValue([]);
    await controller.findAll(req as any, 'active');
    expect(mockService.findAll).toHaveBeenCalledWith('auth-id-1', 'active');
  });

  it('GET /goals/:id — returns goal', async () => {
    mockService.findOne.mockResolvedValue(goal);
    const result = await controller.findOne('goal-1', req as any);
    expect(mockService.findOne).toHaveBeenCalledWith('goal-1', 'auth-id-1');
    expect(result).toBe(goal);
  });

  it('GET /goals/:id — propagates NotFoundException', async () => {
    mockService.findOne.mockRejectedValue(new NotFoundException());
    await expect(controller.findOne('bad-id', req as any)).rejects.toThrow(NotFoundException);
  });

  it('POST /goals — creates goal', async () => {
    mockService.create.mockResolvedValue(goal);
    const dto = { name: 'Emergency Fund', targetAmount: 5000 } as any;
    const result = await controller.create(req as any, dto);
    expect(mockService.create).toHaveBeenCalledWith('auth-id-1', dto);
    expect(result).toBe(goal);
  });

  it('PATCH /goals/:id — updates goal', async () => {
    const updated = { ...goal, currentAmount: 2000 };
    mockService.update.mockResolvedValue(updated);
    const dto = { currentAmount: 2000 } as any;
    const result = await controller.update('goal-1', dto, req as any);
    expect(mockService.update).toHaveBeenCalledWith('goal-1', dto, 'auth-id-1');
    expect(result).toBe(updated);
  });

  it('DELETE /goals/:id — removes goal', async () => {
    mockService.remove.mockResolvedValue({ deleted: true });
    await controller.remove('goal-1', req as any);
    expect(mockService.remove).toHaveBeenCalledWith('goal-1', 'auth-id-1');
  });

  it('POST /goals/:id/complete — completes goal', async () => {
    const completed = { ...goal, status: 'completed' };
    mockService.complete.mockResolvedValue(completed);
    const result = await controller.complete('goal-1', req as any);
    expect(mockService.complete).toHaveBeenCalledWith('goal-1', 'auth-id-1');
    expect(result).toBe(completed);
  });
});

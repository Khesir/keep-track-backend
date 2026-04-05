import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

const mockService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  findSubtasks: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  complete: jest.fn(),
};

const req = { user: { authId: 'auth-id-1' } };
const task = { id: 'task-1', title: 'Build feature', status: 'todo', priority: 'medium' };

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: mockService }],
    }).compile();

    controller = module.get(TasksController);
    jest.clearAllMocks();
  });

  it('GET /tasks — returns list', async () => {
    mockService.findAll.mockResolvedValue([task]);
    const result = await controller.findAll(req as any, {});
    expect(mockService.findAll).toHaveBeenCalledWith('auth-id-1', {});
    expect(result).toEqual([task]);
  });

  it('GET /tasks — passes query filters', async () => {
    mockService.findAll.mockResolvedValue([]);
    const query = { projectId: 'proj-1', status: 'todo', priority: 'high' };
    await controller.findAll(req as any, query);
    expect(mockService.findAll).toHaveBeenCalledWith('auth-id-1', query);
  });

  it('GET /tasks/:id — returns task', async () => {
    mockService.findOne.mockResolvedValue(task);
    const result = await controller.findOne('task-1', req as any);
    expect(mockService.findOne).toHaveBeenCalledWith('task-1', 'auth-id-1');
    expect(result).toBe(task);
  });

  it('GET /tasks/:id — propagates NotFoundException', async () => {
    mockService.findOne.mockRejectedValue(new NotFoundException());
    await expect(controller.findOne('bad-id', req as any)).rejects.toThrow(NotFoundException);
  });

  it('GET /tasks/:id/subtasks — returns subtasks', async () => {
    const subtasks = [{ id: 'sub-1', title: 'Subtask', parentTaskId: 'task-1' }];
    mockService.findSubtasks.mockResolvedValue(subtasks);
    const result = await controller.findSubtasks('task-1', req as any);
    expect(mockService.findSubtasks).toHaveBeenCalledWith('task-1', 'auth-id-1');
    expect(result).toBe(subtasks);
  });

  it('POST /tasks — creates task', async () => {
    mockService.create.mockResolvedValue(task);
    const dto = { title: 'Build feature', projectId: 'proj-1' } as any;
    const result = await controller.create(req as any, dto);
    expect(mockService.create).toHaveBeenCalledWith('auth-id-1', dto);
    expect(result).toBe(task);
  });

  it('PATCH /tasks/:id — updates task', async () => {
    const updated = { ...task, status: 'inProgress' };
    mockService.update.mockResolvedValue(updated);
    const dto = { status: 'inProgress' } as any;
    const result = await controller.update('task-1', dto, req as any);
    expect(mockService.update).toHaveBeenCalledWith('task-1', dto, 'auth-id-1');
    expect(result).toBe(updated);
  });

  it('DELETE /tasks/:id — removes task', async () => {
    mockService.remove.mockResolvedValue({ deleted: true });
    await controller.remove('task-1', req as any);
    expect(mockService.remove).toHaveBeenCalledWith('task-1', 'auth-id-1');
  });

  it('POST /tasks/:id/complete — completes task', async () => {
    const completed = { ...task, status: 'completed', completedAt: new Date().toISOString() };
    mockService.complete.mockResolvedValue(completed);
    const dto = { createTransaction: false } as any;
    const result = await controller.complete('task-1', dto, req as any);
    expect(mockService.complete).toHaveBeenCalledWith('task-1', dto, 'auth-id-1');
    expect(result).toBe(completed);
  });

  it('POST /tasks/:id/complete — creates transaction when requested', async () => {
    mockService.complete.mockResolvedValue({ ...task, status: 'completed' });
    const dto = { createTransaction: true, actualAmount: 200, accountId: 'acc-1', transactionDate: '2025-01-01' } as any;
    await controller.complete('task-1', dto, req as any);
    expect(mockService.complete).toHaveBeenCalledWith('task-1', dto, 'auth-id-1');
  });
});

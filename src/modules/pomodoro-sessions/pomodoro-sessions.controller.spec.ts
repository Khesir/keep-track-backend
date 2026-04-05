import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PomodoroSessionsController } from './pomodoro-sessions.controller';
import { PomodoroSessionsService } from './pomodoro-sessions.service';

const mockService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  complete: jest.fn(),
  cancel: jest.fn(),
  addTask: jest.fn(),
};

const req = { user: { authId: 'auth-id-1' } };
const session = { id: 'session-1', type: 'pomodoro', durationSeconds: 1500, status: 'running' };

describe('PomodoroSessionsController', () => {
  let controller: PomodoroSessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PomodoroSessionsController],
      providers: [{ provide: PomodoroSessionsService, useValue: mockService }],
    }).compile();

    controller = module.get(PomodoroSessionsController);
    jest.clearAllMocks();
  });

  it('GET /pomodoro-sessions — returns list', async () => {
    mockService.findAll.mockResolvedValue([session]);
    const result = await controller.findAll(req as any, {});
    expect(mockService.findAll).toHaveBeenCalledWith('auth-id-1', {});
    expect(result).toEqual([session]);
  });

  it('GET /pomodoro-sessions — passes query filters', async () => {
    mockService.findAll.mockResolvedValue([]);
    const query = { projectId: 'proj-1', status: 'completed', type: 'pomodoro' };
    await controller.findAll(req as any, query);
    expect(mockService.findAll).toHaveBeenCalledWith('auth-id-1', query);
  });

  it('GET /pomodoro-sessions/:id — returns session', async () => {
    mockService.findOne.mockResolvedValue(session);
    const result = await controller.findOne('session-1', req as any);
    expect(mockService.findOne).toHaveBeenCalledWith('session-1', 'auth-id-1');
    expect(result).toBe(session);
  });

  it('GET /pomodoro-sessions/:id — propagates NotFoundException', async () => {
    mockService.findOne.mockRejectedValue(new NotFoundException());
    await expect(controller.findOne('bad-id', req as any)).rejects.toThrow(NotFoundException);
  });

  it('POST /pomodoro-sessions — creates session', async () => {
    mockService.create.mockResolvedValue(session);
    const dto = { type: 'pomodoro', durationSeconds: 1500 } as any;
    const result = await controller.create(req as any, dto);
    expect(mockService.create).toHaveBeenCalledWith('auth-id-1', dto);
    expect(result).toBe(session);
  });

  it('DELETE /pomodoro-sessions/:id — removes session', async () => {
    mockService.remove.mockResolvedValue({ deleted: true });
    await controller.remove('session-1', req as any);
    expect(mockService.remove).toHaveBeenCalledWith('session-1', 'auth-id-1');
  });

  it('POST /pomodoro-sessions/:id/pause — pauses session', async () => {
    const paused = { ...session, status: 'paused' };
    mockService.pause.mockResolvedValue(paused);
    const result = await controller.pause('session-1', req as any);
    expect(mockService.pause).toHaveBeenCalledWith('session-1', 'auth-id-1');
    expect(result).toBe(paused);
  });

  it('POST /pomodoro-sessions/:id/resume — resumes session', async () => {
    const resumed = { ...session, status: 'running' };
    mockService.resume.mockResolvedValue(resumed);
    const result = await controller.resume('session-1', req as any);
    expect(mockService.resume).toHaveBeenCalledWith('session-1', 'auth-id-1');
    expect(result).toBe(resumed);
  });

  it('POST /pomodoro-sessions/:id/complete — completes session', async () => {
    const completed = { ...session, status: 'completed' };
    mockService.complete.mockResolvedValue(completed);
    const result = await controller.complete('session-1', req as any);
    expect(mockService.complete).toHaveBeenCalledWith('session-1', 'auth-id-1');
    expect(result).toBe(completed);
  });

  it('POST /pomodoro-sessions/:id/cancel — cancels session', async () => {
    const cancelled = { ...session, status: 'cancelled' };
    mockService.cancel.mockResolvedValue(cancelled);
    const result = await controller.cancel('session-1', req as any);
    expect(mockService.cancel).toHaveBeenCalledWith('session-1', 'auth-id-1');
    expect(result).toBe(cancelled);
  });

  it('POST /pomodoro-sessions/:id/tasks — adds task to session', async () => {
    const updated = { ...session, taskIds: ['task-1'] };
    mockService.addTask.mockResolvedValue(updated);
    const result = await controller.addTask('session-1', { taskId: 'task-1' } as any, req as any);
    expect(mockService.addTask).toHaveBeenCalledWith('session-1', 'task-1', 'auth-id-1');
    expect(result).toBe(updated);
  });
});

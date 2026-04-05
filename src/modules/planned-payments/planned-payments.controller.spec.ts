import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PlannedPaymentsController } from './planned-payments.controller';
import { PlannedPaymentsService } from './planned-payments.service';

const mockService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  pay: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  cancel: jest.fn(),
};

const req = { user: { authId: 'auth-id-1' } };
const payment = { id: 'pp-1', name: 'Netflix', amount: 15, frequency: 'monthly', nextPaymentDate: '2025-02-01' };

describe('PlannedPaymentsController', () => {
  let controller: PlannedPaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlannedPaymentsController],
      providers: [{ provide: PlannedPaymentsService, useValue: mockService }],
    }).compile();

    controller = module.get(PlannedPaymentsController);
    jest.clearAllMocks();
  });

  it('GET /planned-payments — returns list', async () => {
    mockService.findAll.mockResolvedValue([payment]);
    const result = await controller.findAll(req as any, undefined, undefined, undefined);
    expect(mockService.findAll).toHaveBeenCalledWith('auth-id-1', undefined, undefined, undefined);
    expect(result).toEqual([payment]);
  });

  it('GET /planned-payments — filters by status, category, upcoming', async () => {
    mockService.findAll.mockResolvedValue([]);
    await controller.findAll(req as any, 'active', 'subscriptions', 'true');
    expect(mockService.findAll).toHaveBeenCalledWith('auth-id-1', 'active', 'subscriptions', 'true');
  });

  it('GET /planned-payments/:id — returns payment', async () => {
    mockService.findOne.mockResolvedValue(payment);
    const result = await controller.findOne('pp-1', req as any);
    expect(mockService.findOne).toHaveBeenCalledWith('pp-1', 'auth-id-1');
    expect(result).toBe(payment);
  });

  it('GET /planned-payments/:id — propagates NotFoundException', async () => {
    mockService.findOne.mockRejectedValue(new NotFoundException());
    await expect(controller.findOne('bad-id', req as any)).rejects.toThrow(NotFoundException);
  });

  it('POST /planned-payments — creates payment', async () => {
    mockService.create.mockResolvedValue(payment);
    const dto = { name: 'Netflix', amount: 15, category: 'subscriptions', frequency: 'monthly', nextPaymentDate: '2025-02-01' } as any;
    const result = await controller.create(req as any, dto);
    expect(mockService.create).toHaveBeenCalledWith('auth-id-1', dto);
    expect(result).toBe(payment);
  });

  it('PATCH /planned-payments/:id — updates payment', async () => {
    const updated = { ...payment, amount: 20 };
    mockService.update.mockResolvedValue(updated);
    const dto = { amount: 20 } as any;
    const result = await controller.update('pp-1', dto, req as any);
    expect(mockService.update).toHaveBeenCalledWith('pp-1', dto, 'auth-id-1');
    expect(result).toBe(updated);
  });

  it('DELETE /planned-payments/:id — removes payment', async () => {
    mockService.remove.mockResolvedValue({ deleted: true });
    await controller.remove('pp-1', req as any);
    expect(mockService.remove).toHaveBeenCalledWith('pp-1', 'auth-id-1');
  });

  it('POST /planned-payments/:id/pay — records payment', async () => {
    const paid = { ...payment, lastPaymentDate: '2025-01-01' };
    mockService.pay.mockResolvedValue(paid);
    const dto = { paidDate: '2025-01-01', createTransaction: true } as any;
    const result = await controller.pay('pp-1', dto, req as any);
    expect(mockService.pay).toHaveBeenCalledWith('pp-1', dto, 'auth-id-1');
    expect(result).toBe(paid);
  });

  it('POST /planned-payments/:id/pause — pauses payment', async () => {
    const paused = { ...payment, status: 'paused' };
    mockService.pause.mockResolvedValue(paused);
    const result = await controller.pause('pp-1', req as any);
    expect(mockService.pause).toHaveBeenCalledWith('pp-1', 'auth-id-1');
    expect(result).toBe(paused);
  });

  it('POST /planned-payments/:id/resume — resumes payment', async () => {
    const resumed = { ...payment, status: 'active' };
    mockService.resume.mockResolvedValue(resumed);
    const result = await controller.resume('pp-1', req as any);
    expect(mockService.resume).toHaveBeenCalledWith('pp-1', 'auth-id-1');
    expect(result).toBe(resumed);
  });

  it('POST /planned-payments/:id/cancel — cancels payment', async () => {
    const cancelled = { ...payment, status: 'cancelled' };
    mockService.cancel.mockResolvedValue(cancelled);
    const result = await controller.cancel('pp-1', req as any);
    expect(mockService.cancel).toHaveBeenCalledWith('pp-1', 'auth-id-1');
    expect(result).toBe(cancelled);
  });
});

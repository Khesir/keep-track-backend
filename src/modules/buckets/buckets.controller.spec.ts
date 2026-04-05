import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BucketsController } from './buckets.controller';
import { BucketsService } from './buckets.service';

const mockService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const req = { user: { authId: 'auth-id-1' } };
const bucket = { id: 'bucket-1', name: 'Work', isArchive: false };

describe('BucketsController', () => {
  let controller: BucketsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BucketsController],
      providers: [{ provide: BucketsService, useValue: mockService }],
    }).compile();

    controller = module.get(BucketsController);
    jest.clearAllMocks();
  });

  it('GET /buckets — returns list', async () => {
    mockService.findAll.mockResolvedValue([bucket]);
    const result = await controller.findAll(req as any, undefined);
    expect(mockService.findAll).toHaveBeenCalledWith('auth-id-1', undefined);
    expect(result).toEqual([bucket]);
  });

  it('GET /buckets — filters by isArchive', async () => {
    mockService.findAll.mockResolvedValue([]);
    await controller.findAll(req as any, 'false');
    expect(mockService.findAll).toHaveBeenCalledWith('auth-id-1', 'false');
  });

  it('GET /buckets/:id — returns bucket', async () => {
    mockService.findOne.mockResolvedValue(bucket);
    const result = await controller.findOne('bucket-1', req as any);
    expect(mockService.findOne).toHaveBeenCalledWith('bucket-1', 'auth-id-1');
    expect(result).toBe(bucket);
  });

  it('GET /buckets/:id — propagates NotFoundException', async () => {
    mockService.findOne.mockRejectedValue(new NotFoundException());
    await expect(controller.findOne('bad-id', req as any)).rejects.toThrow(NotFoundException);
  });

  it('POST /buckets — creates bucket', async () => {
    mockService.create.mockResolvedValue(bucket);
    const dto = { name: 'Work' } as any;
    const result = await controller.create(req as any, dto);
    expect(mockService.create).toHaveBeenCalledWith('auth-id-1', dto);
    expect(result).toBe(bucket);
  });

  it('PATCH /buckets/:id — updates bucket', async () => {
    const updated = { ...bucket, name: 'Personal' };
    mockService.update.mockResolvedValue(updated);
    const dto = { name: 'Personal' } as any;
    const result = await controller.update('bucket-1', dto, req as any);
    expect(mockService.update).toHaveBeenCalledWith('bucket-1', dto, 'auth-id-1');
    expect(result).toBe(updated);
  });

  it('DELETE /buckets/:id — removes bucket', async () => {
    mockService.remove.mockResolvedValue({ deleted: true });
    await controller.remove('bucket-1', req as any);
    expect(mockService.remove).toHaveBeenCalledWith('bucket-1', 'auth-id-1');
  });
});

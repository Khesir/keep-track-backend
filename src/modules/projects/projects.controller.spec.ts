import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

const mockService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const req = { user: { authId: 'auth-id-1' } };
const project = { id: 'proj-1', name: 'My App', status: 'active', bucketId: 'bucket-1' };

describe('ProjectsController', () => {
  let controller: ProjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [{ provide: ProjectsService, useValue: mockService }],
    }).compile();

    controller = module.get(ProjectsController);
    jest.clearAllMocks();
  });

  it('GET /projects — returns list', async () => {
    mockService.findAll.mockResolvedValue([project]);
    const result = await controller.findAll(req as any, undefined, undefined, undefined);
    expect(mockService.findAll).toHaveBeenCalledWith('auth-id-1', undefined, undefined, undefined);
    expect(result).toEqual([project]);
  });

  it('GET /projects — filters by status, isArchived, bucketId', async () => {
    mockService.findAll.mockResolvedValue([]);
    await controller.findAll(req as any, 'active', 'false', 'bucket-1');
    expect(mockService.findAll).toHaveBeenCalledWith('auth-id-1', 'active', 'false', 'bucket-1');
  });

  it('GET /projects/:id — returns project', async () => {
    mockService.findOne.mockResolvedValue(project);
    const result = await controller.findOne('proj-1', req as any);
    expect(mockService.findOne).toHaveBeenCalledWith('proj-1', 'auth-id-1');
    expect(result).toBe(project);
  });

  it('GET /projects/:id — propagates NotFoundException', async () => {
    mockService.findOne.mockRejectedValue(new NotFoundException());
    await expect(controller.findOne('bad-id', req as any)).rejects.toThrow(NotFoundException);
  });

  it('POST /projects — creates project', async () => {
    mockService.create.mockResolvedValue(project);
    const dto = { name: 'My App', bucketId: 'bucket-1' } as any;
    const result = await controller.create(req as any, dto);
    expect(mockService.create).toHaveBeenCalledWith('auth-id-1', dto);
    expect(result).toBe(project);
  });

  it('PATCH /projects/:id — updates project', async () => {
    const updated = { ...project, name: 'Updated App' };
    mockService.update.mockResolvedValue(updated);
    const dto = { name: 'Updated App' } as any;
    const result = await controller.update('proj-1', dto, req as any);
    expect(mockService.update).toHaveBeenCalledWith('proj-1', dto, 'auth-id-1');
    expect(result).toBe(updated);
  });

  it('DELETE /projects/:id — removes project', async () => {
    mockService.remove.mockResolvedValue({ deleted: true });
    await controller.remove('proj-1', req as any);
    expect(mockService.remove).toHaveBeenCalledWith('proj-1', 'auth-id-1');
  });
});

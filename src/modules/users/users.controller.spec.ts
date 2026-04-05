import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockService = {
  getMe: jest.fn(),
  updateMe: jest.fn(),
  updateNotificationSettings: jest.fn(),
  updatePomodoroSettings: jest.fn(),
  streamPhoto: jest.fn(),
  uploadPhoto: jest.fn(),
};

const req = { user: { authId: 'auth-id-1' } };
const user = { id: 'user-1', email: 'a@b.com', displayName: 'Alice' };

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockService }],
    }).compile();

    controller = module.get(UsersController);
    jest.clearAllMocks();
  });

  it('GET /users/me — returns current user', async () => {
    mockService.getMe.mockResolvedValue(user);
    const result = await controller.getMe(req as any);
    expect(mockService.getMe).toHaveBeenCalledWith('auth-id-1');
    expect(result).toBe(user);
  });

  it('PATCH /users/me — updates user profile', async () => {
    const updated = { ...user, displayName: 'Alice Updated' };
    mockService.updateMe.mockResolvedValue(updated);
    const dto = { displayName: 'Alice Updated' } as any;
    const result = await controller.updateMe(req as any, dto);
    expect(mockService.updateMe).toHaveBeenCalledWith('auth-id-1', dto);
    expect(result).toBe(updated);
  });

  it('PATCH /users/me/notification-settings — updates notification settings', async () => {
    const settings = { financeReminderEnabled: true };
    mockService.updateNotificationSettings.mockResolvedValue(user);
    const dto = { financeReminderEnabled: true } as any;
    const result = await controller.updateNotificationSettings(req as any, dto);
    expect(mockService.updateNotificationSettings).toHaveBeenCalledWith('auth-id-1', dto);
    expect(result).toBe(user);
  });

  it('PATCH /users/me/pomodoro-settings — updates pomodoro settings', async () => {
    mockService.updatePomodoroSettings.mockResolvedValue(user);
    const dto = { pomodoroDuration: 30, shortBreakDuration: 10 } as any;
    const result = await controller.updatePomodoroSettings(req as any, dto);
    expect(mockService.updatePomodoroSettings).toHaveBeenCalledWith('auth-id-1', dto);
    expect(result).toBe(user);
  });

  it('GET /users/me/photo — streams photo', () => {
    const res = {} as any;
    mockService.streamPhoto.mockReturnValue(undefined);
    controller.streamPhoto(req as any, res);
    expect(mockService.streamPhoto).toHaveBeenCalledWith('auth-id-1', res);
  });

  it('POST /users/me/photo — uploads photo', async () => {
    const file = { originalname: 'photo.jpg', buffer: Buffer.from('') } as any;
    mockService.uploadPhoto.mockResolvedValue({ photoUrl: 'https://cdn/photo.jpg' });
    const result = await controller.uploadPhoto(req as any, file);
    expect(mockService.uploadPhoto).toHaveBeenCalledWith('auth-id-1', file);
    expect(result).toEqual({ photoUrl: 'https://cdn/photo.jpg' });
  });
});

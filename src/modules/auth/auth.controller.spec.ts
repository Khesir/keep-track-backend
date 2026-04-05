import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
  googleSignIn: jest.fn(),
  refresh: jest.fn(),
  logout: jest.fn(),
};

const authResult = { accessToken: 'access', refreshToken: 'refresh', user: { id: '1', email: 'a@b.com' } };
const req = { user: { authId: 'auth-id-1' } };

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get(AuthController);
    jest.clearAllMocks();
  });

  it('POST /auth/register — calls service with email & password', async () => {
    mockAuthService.register.mockResolvedValue(authResult);
    const result = await controller.register({ email: 'a@b.com', password: 'pass1234' } as any);
    expect(mockAuthService.register).toHaveBeenCalledWith('a@b.com', 'pass1234');
    expect(result).toBe(authResult);
  });

  it('POST /auth/login — calls service with credentials', async () => {
    mockAuthService.login.mockResolvedValue(authResult);
    const result = await controller.login({ email: 'a@b.com', password: 'pass1234' } as any);
    expect(mockAuthService.login).toHaveBeenCalledWith('a@b.com', 'pass1234');
    expect(result).toBe(authResult);
  });

  it('POST /auth/google — calls service with idToken', async () => {
    mockAuthService.googleSignIn.mockResolvedValue(authResult);
    const result = await controller.googleSignIn({ idToken: 'google-token' } as any);
    expect(mockAuthService.googleSignIn).toHaveBeenCalledWith('google-token');
    expect(result).toBe(authResult);
  });

  it('POST /auth/refresh — calls service with refreshToken', async () => {
    mockAuthService.refresh.mockResolvedValue(authResult);
    const result = await controller.refresh({ refreshToken: 'refresh-token' } as any);
    expect(mockAuthService.refresh).toHaveBeenCalledWith('refresh-token');
    expect(result).toBe(authResult);
  });

  it('POST /auth/logout — calls service with authId and refreshToken', async () => {
    mockAuthService.logout.mockResolvedValue({ message: 'logged out' });
    const result = await controller.logout(req as any, { refreshToken: 'refresh-token' } as any);
    expect(mockAuthService.logout).toHaveBeenCalledWith('auth-id-1', 'refresh-token');
    expect(result).toEqual({ message: 'logged out' });
  });
});

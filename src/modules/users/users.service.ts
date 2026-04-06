import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { put } from '@vercel/blob';
import { Response, Express} from 'express';
import { User, UserDocument } from '../../schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';
import { UpdatePomodoroSettingsDto } from './dto/update-pomodoro-settings.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getMe(authId: string) {
    const user = await this.userModel.findById(authId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateMe(authId: string, dto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(authId, dto, { new: true });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateNotificationSettings(
    authId: string,
    dto: UpdateNotificationSettingsDto,
  ) {
    const update = Object.fromEntries(
      Object.entries(dto).map(([k, v]) => [`notificationSettings.${k}`, v]),
    );
    const user = await this.userModel.findByIdAndUpdate(
      authId,
      { $set: update },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updatePomodoroSettings(authId: string, dto: UpdatePomodoroSettingsDto) {
    const update = Object.fromEntries(
      Object.entries(dto).map(([k, v]) => [`pomodoroSettings.${k}`, v]),
    );
    const user = await this.userModel.findByIdAndUpdate(
      authId,
      { $set: update },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async uploadPhoto(authId: string, file: Express.Multer.File) {
    const ext = file.originalname.split('.').pop();
    const filename = `avatars/${authId}-${Date.now()}.${ext}`;

    const blob = await put(filename, file.buffer, {
      access: 'private' as any,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: file.mimetype,
    });

    const user = await this.userModel.findByIdAndUpdate(
      authId,
      { photoUrl: blob.url },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');

    // Return the internal API route, not the private blob URL
    return { photoUrl: `/api/v1/users/me/photo` };
  }

  async streamPhoto(authId: string, res: Response) {
    const user = await this.userModel.findById(authId);
    if (!user || !user.photoUrl) throw new NotFoundException('No photo uploaded');

    const blobRes = await fetch(user.photoUrl, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });

    if (!blobRes.ok) throw new NotFoundException('Photo not found');

    const contentType = blobRes.headers.get('content-type') ?? 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'private, max-age=3600');

    const buffer = Buffer.from(await blobRes.arrayBuffer());
    res.send(buffer);
  }
}

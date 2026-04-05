import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { RefreshToken, RefreshTokenDocument } from 'src/schemas/refresh-token.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existing = await this.userModel.findOne({ email });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.userModel.create({
      authId: new (require('mongoose').Types.ObjectId)().toString(),
      email,
      passwordHash,
    });

    // Set authId to the MongoDB _id for consistency
    user.authId = user._id.toString();
    await user.save();

    return this.issueTokenPair(user);
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email }).select('+passwordHash');
    if (!user || !user.passwordHash)
      throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.issueTokenPair(user);
  }

  async googleSignIn(dto: { idToken?: string; accessToken?: string }) {
    let payload: any;

    if (dto.idToken) {
      // Mobile flow — verify ID token via tokeninfo
      const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${dto.idToken}`,
      );
      payload = await response.json();

      if (payload.error_description) {
        throw new UnauthorizedException('Google token expired or invalid');
      }
      if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
        throw new UnauthorizedException('Invalid Google token audience');
      }
    } else if (dto.accessToken) {
      // Web flow — verify access token via userinfo endpoint
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${dto.accessToken}` },
      });
      payload = await response.json();

      if (payload.error || !payload.email) {
        throw new UnauthorizedException('Google access token invalid or expired');
      }
    } else {
      throw new UnauthorizedException('No Google token provided');
    }

    const user = await this.userModel.findOneAndUpdate(
      { email: payload.email },
      {
        $setOnInsert: {
          email: payload.email,
          displayName: payload.name ?? null,
          photoUrl: payload.picture ?? null,
          googleId: payload.sub,
          passwordHash: null,
        },
      },
      { upsert: true, new: true },
    );

    // Ensure authId is set to MongoDB _id
    if (!user.authId || user.authId !== user._id.toString()) {
      user.authId = user._id.toString();
      await user.save();
    }

    return this.issueTokenPair(user);
  }

  async refresh(incomingToken: string) {
    let payload: { sub: string; email: string };

    try {
      payload = this.jwtService.verify(incomingToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Refresh token invalid or expired');
    }

    const candidates = await this.refreshTokenModel.find({
      userId: payload.sub,
      revoked: false,
      expiresAt: { $gt: new Date() },
    });

    let matched: RefreshTokenDocument | null = null;
    for (const candidate of candidates) {
      const isMatch = await bcrypt.compare(incomingToken, candidate.token);
      if (isMatch) {
        matched = candidate;
        break;
      }
    }

    if (!matched) throw new UnauthorizedException('Refresh token invalid or expired');

    await matched.deleteOne();
    const user = await this.userModel.findById(payload.sub);
    if (!user) throw new UnauthorizedException('User not found');

    return this.issueTokenPair(user);
  }

  async logout(userId: string, refreshToken: string) {
    const candidates = await this.refreshTokenModel.find({
      userId,
      revoked: false,
    });

    for (const candidate of candidates) {
      const isMatch = await bcrypt.compare(refreshToken, candidate.token);
      if (isMatch) {
        await candidate.deleteOne();
        return;
      }
    }
  }

  private async issueTokenPair(user: UserDocument) {
    const payload = { sub: user._id.toString(), email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '30d',
    });

    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.refreshTokenModel.create({
      userId: user._id.toString(),
      token: hashed,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName ?? null,
      },
    };
  }
}

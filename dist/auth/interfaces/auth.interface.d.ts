import { Request } from 'express';
import { ValidatedUser } from '../auth.service';
import { User } from 'src/user/user.entity';
export interface Payload {
    email: string;
    sub: string;
}
export interface JwtPayload {
    sub: string;
    email: string;
    iat?: number;
    exp?: number;
}
export interface UserWithRefreshToken extends JwtPayload {
    refreshToken: string;
}
export interface RequestWithUser extends Request {
    user: User;
}
export interface RequestWithRefreshUser extends Request {
    user: UserWithRefreshToken;
}
export interface RequestWithValidatedUser extends Request {
    user: ValidatedUser;
}

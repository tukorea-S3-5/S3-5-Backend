export declare class User {
    user_id: string;
    email: string;
    password: string;
    name: string;
    birth_date: Date;
    created_at: Date;
    currentRefreshToken: string | null;
    hashPassword(plainTextPassword: string): Promise<void>;
    comparePassword(plainTextPassword: string): Promise<boolean>;
    setRefreshToken(refreshToken: string): Promise<void>;
    compareRefreshToken(refreshToken: string): Promise<boolean>;
    removeRefreshToken(): void;
}

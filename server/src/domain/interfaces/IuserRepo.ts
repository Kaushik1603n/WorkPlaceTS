export interface userRepoI {
  findById(_id: string): Promise<any>;
  findByEmail(email: string): Promise<any>;
  storeRefreshToken(userId: string, refreshToken: string): Promise<void>;
  clearRefreshToken(userId: string): Promise<void>;
  createUser(userData: any): Promise<any>;
}

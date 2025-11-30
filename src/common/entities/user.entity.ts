export interface UserEntity {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export type SafeUser = Omit<UserEntity, 'password'>;

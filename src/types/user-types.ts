export const role = ['EDITOR', 'ADMIN'] as const;

type Role = (typeof role)[number];

export type LoginResponse = {
  data: UserResponse;
  access_token: string;
};

export type RefreshResponse = LoginResponse;

export type UserResponse = {
  username: string;
  name: string;
  role: Role;
};

export type CreateUserRequest = {
  username: string;
  name: string;
  password: string;
  role: Role;
};

export type LoginUserRequest = {
  username: string;
  password: string;
};

export type UpdateUserCurrentRequest = {
  name?: string;
  password?: string;
  currentPassword: string;
  role?: Role;
};

export type UpdateUserRequest = {
  username: string;
  name?: string;
  password?: string;
  role?: Role;
};

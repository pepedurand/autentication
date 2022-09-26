export enum UserRole {
  NORMAL = "normal",
  ADMIN = "admin",
}

export type user = {
  id: string;
  email: string;
  password: string;
  name: string;
  nickname: string;
  role: UserRole;
};

export type authenticationData = {
  id: string;
  role: UserRole;
};

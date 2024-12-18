import { IRole } from './user.types';

export interface ILogin {
  email: string;
  password: string;
}

export interface IResponseLogin {
  id: string;
  fullName: null;
  gender: null;
  avatar: string;
  phoneNumber: null;
  email: string;
  role: IRole;
  createdAt: string;
  updatedAt: string;
  accessToken: string;
  accountBalance: number;
}

export interface IUser {
  id: string;
  fullName: string | null;
  avatar: string | null;
  gender: string | null;
  phoneNumber: number | null;
  email: string;
  role: IRole;
  accountBalance: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface IQueryUser {
  page: number;
  limit: number;
  total: number;
  nameLike: string;
}

export type IRole = 'USER' | 'ADMIN';

import { IUser } from './user.types';

export type TTransactionType = 'GATHER_BOOKING' | 'COURT_BOOKING';

export interface ITransactionHistory {
  id: string;
  transactionUserId: string;
  receiveUserId: string;
  transactionType: TTransactionType;
  transactionAmount: number;
  discountedAdmin: number;
  createdAt: string;
  updatedAt: string;
  transactionUser: IUser;
  receiveUser: IUser;
}

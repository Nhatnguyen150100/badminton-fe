import { IBadmintonGather } from './badmintonGather.types';
import { IStatusLabel } from './status.types';
import { IUser } from './user.types';

export interface IBadmintonGatherBookingOwner {
  id: string;
  userId: string;
  badmintonGatherId: string;
  numberMale: number;
  numberFemale: number;
  note: string;
  status: IStatusLabel;
  createdAt: string;
  updatedAt: string;
  user: IUser;
}

export interface IBadmintonGatherBookingUser {
  id: string;
  userId: string;
  user: IUser;
  badmintonGatherId: string;
  numberMale: number;
  numberFemale: number;
  note: string;
  status: IStatusLabel;
  createdAt: string;
  updatedAt: string;
  badmintonGather: IBadmintonGather;
}

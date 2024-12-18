import { IBaseQuery } from './query.types';
import { ISchedule } from './schedule.types';
import { IStatusLabel } from './status.types';
import { IUser } from './user.types';

export interface IBadmintonCourt {
  id: string;
  name: string;
  district: string;
  ward: string;
  address: string;
  lang: number;
  lat: number;
  userId: string;
  imageCourt: string;
  schedules?: ISchedule[];
  user?: IUser;
  description: string;
  status: IStatusLabel;
  createdAt: string;
  updatedAt: string;
  totalCourtNumber?: number
}

export interface ILatLng {
  lat: number;
  lng: number;
}

export interface IQueryBadmintonCourtAdmin extends IBaseQuery {
  status?: IStatusLabel;
}

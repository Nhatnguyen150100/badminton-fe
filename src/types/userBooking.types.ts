import { IBadmintonCourt } from './badmintonCourt.types';
import { ICourtNumber } from './courtNumber.types';
import { IStatusLabel } from './status.types';
import { ITimeBooking } from './timeBooking.types';
import { IUser } from './user.types';

export interface IUserBooking {
  id: string;
  userId: string;
  note: string;
  updatedAt: string;
  createdAt: string;
}

export interface IUserBookingDetail {
  id: string;
  status: IStatusLabel;
  note: string;
  schedule: IScheduleUserBooking;
}

export interface IUserBookingDetailByAdmin extends IUserBookingDetail {
  user: IUser;
}

interface IScheduleUserBooking {
  appointmentDate: string;
  constBooking: number;
  badmintonCourt: IBadmintonCourt;
  courtNumber: ICourtNumber;
  timeBooking: ITimeBooking;
}

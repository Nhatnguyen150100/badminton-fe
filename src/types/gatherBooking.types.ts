import { IStatusLabel } from './status.types';

export interface IGatherBooking {
  id: string;
  userId: string;
  badmintonGatherId: string;
  numberMale: number;
  numberFemale: number;
  note: string | null;
  status: IStatusLabel;
  createdAt: string;
  updatedAt: string;
}

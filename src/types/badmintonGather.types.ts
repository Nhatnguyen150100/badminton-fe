import { IBadmintonGatherComments } from "./badmintonGatherComment.types";
import { IUser } from "./user.types";

export interface IBadmintonGather {
  id: string;
  userId: string;
  nameClub: string;
  description: string;
  badmintonCourtName: string;
  district: string;
  ward: string;
  address: string;
  lang: number;
  lat: number;
  courtNumber: string;
  startTime: string;
  endTime: string;
  appointmentDate: string;
  totalMale: number;
  totalFemale: number;
  constPerMale: number;
  constPerFemale: number;
  imgCourt: string;
  level: ILevel;
  user?: IUser;
  badmintonGatherComments?: IBadmintonGatherComments[]
  createdAt: string;
  updatedAt: string;
}


export type ILevel = 'Y' | 'TB_Y' | 'TB' | 'TB_K' | 'K' | 'CN'
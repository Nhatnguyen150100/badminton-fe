import { IUser } from "./user.types";

export interface IBadmintonGatherComments {
  id: string;
  userId: string;
  badmintonGatherId: string;
  comment: string;
  user?: IUser;
  createdAt: string;
  updatedAt: string;
}
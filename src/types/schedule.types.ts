import { IScheduleStatusLabel } from "./status.types";

export interface ISchedule {
  id: string;
  badmintonCourtId: string;
  courtNumberId: string;
  timeBookingId: string;
  appointmentDate: string;
  constBooking: number;
  status: IScheduleStatusLabel;
  createdAt: string;
  updatedAt: string;
  courtNumber: CourtNumber;
  timeBooking: TimeBooking;
}

interface TimeBooking {
  startTime: string;
  endTime: string;
}

interface CourtNumber {
  name: string;
}
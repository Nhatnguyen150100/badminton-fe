import AuthService from './authService';
import BadmintonCourtService from './badmintonCourtService';
import BadmintonGatherBookingService from './badmintonGatherBookingService';
import BadmintonGatherCommentService from './badmintonGatherComment';
import BadmintonGatherService from './badmintonGatherService';
import CourtNumberService from './courtNumberService';
import GatherBookingService from './gatherBookingService';
import ProfileService from './profileService';
import ScheduleService from './scheduleService';
import TimeBookingService from './timeBookingService';
import UserBookingService from './UserBookingService';

export const authService = new AuthService();
export const profileService = new ProfileService();
export const badmintonCourtService = new BadmintonCourtService();
export const courtNumberService = new CourtNumberService();
export const timeBookingService = new TimeBookingService();
export const scheduleService = new ScheduleService();
export const userBookingService = new UserBookingService();
export const badmintonGatherService = new BadmintonGatherService();
export const gatherBookingService = new GatherBookingService();
export const badmintonGatherBookingService =
  new BadmintonGatherBookingService();
export const badmintonGatherCommentService =
  new BadmintonGatherCommentService();

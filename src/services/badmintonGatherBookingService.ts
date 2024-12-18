import axiosRequest from '../plugins/request';
import { IBadmintonGather } from '../types/badmintonGather.types';
import {
  IBadmintonGatherBookingOwner,
  IBadmintonGatherBookingUser,
} from '../types/badmintonGatherBooking.types';
import { IBaseQuery } from '../types/query.types';
import { IBaseResponse, IBaseResponseList } from '../types/response.types';
import onRemoveParams from '../utils/functions/on-remove-params';

class BadmintonGatherBookingService {
  private _prefixURL = '/v1/gather-booking';

  public async getBadmintonGatherBookingByOwner(
    id: string,
    query: IBaseQuery,
  ): Promise<IBaseResponse<IBaseResponseList<IBadmintonGatherBookingOwner[]>>> {
    try {
      const rs = await axiosRequest.get(`${this._prefixURL}/by-owner/${id}`, {
        params: onRemoveParams(query),
      });
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getBadmintonGatherBookingByUser(
    id: string,
    query: IBaseQuery,
  ): Promise<IBaseResponse<IBaseResponseList<IBadmintonGatherBookingUser[]>>> {
    try {
      const rs = await axiosRequest.get(`${this._prefixURL}/by-user/${id}`, {
        params: onRemoveParams(query),
      });
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async acceptUserBooking(id: string): Promise<IBaseResponse<any>> {
    try {
      const rs = await axiosRequest.put(
        `${this._prefixURL}/accept-gather-booking/${id}`,
      );
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async deniedUserBooking(id: string): Promise<IBaseResponse<any>> {
    try {
      const rs = await axiosRequest.put(
        `${this._prefixURL}/denied-gather-booking/${id}`,
      );
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default BadmintonGatherBookingService;

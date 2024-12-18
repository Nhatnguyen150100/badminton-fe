import axiosRequest from '../plugins/request';
import { IBaseQuery } from '../types/query.types';
import { IBaseResponse, IBaseResponseList } from '../types/response.types';
import {
  IUserBooking,
  IUserBookingDetail,
  IUserBookingDetailByAdmin,
} from '../types/userBooking.types';
import onRemoveParams from '../utils/functions/on-remove-params';

class UserBookingService {
  private _prefixURL = '/v1/user-booking';

  public async createUserBooking(
    data: Record<string, any>,
  ): Promise<IBaseResponse<IUserBooking>> {
    try {
      const rs = await axiosRequest.post(this._prefixURL, data);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getListUserBookingByUser(
    id: string,
    query: IBaseQuery,
  ): Promise<IBaseResponse<IBaseResponseList<IUserBookingDetail[]>>> {
    try {
      const rs = await axiosRequest.get(`${this._prefixURL}/by-user/${id}`, {
        params: onRemoveParams(query),
      });
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getListUserBookingOwnerCourt(
    id: string,
    query: IBaseQuery,
  ): Promise<IBaseResponse<IBaseResponseList<IUserBookingDetailByAdmin[]>>> {
    try {
      const rs = await axiosRequest.get(
        `${this._prefixURL}/by-badminton-court/${id}`,
        {
          params: onRemoveParams(query),
        },
      );
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async acceptUserBooking(id: string): Promise<IBaseResponse<any>> {
    try {
      const rs = await axiosRequest.put(
        `${this._prefixURL}/accept-booking/${id}`,
      );
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async deniedUserBooking(id: string): Promise<IBaseResponse<any>> {
    try {
      const rs = await axiosRequest.put(
        `${this._prefixURL}/denied-booking/${id}`,
      );
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async cancelUserBooking(id: string): Promise<IBaseResponse<any>> {
    try {
      const rs = await axiosRequest.put(
        `${this._prefixURL}/cancel-booking/${id}`,
      );
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default UserBookingService;

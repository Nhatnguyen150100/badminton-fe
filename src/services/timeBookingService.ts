import axiosRequest from '../plugins/request';
import { IBaseQuery } from '../types/query.types';
import { IBaseResponse, IBaseResponseList } from '../types/response.types';
import { ITimeBooking } from '../types/timeBooking.types';
import onRemoveParams from '../utils/functions/on-remove-params';

class TimeBookingService {
  private _prefixURL = '/v1/time-booking';

  public async getListTimeBooking(
    id: string,
    query: IBaseQuery,
  ): Promise<IBaseResponse<IBaseResponseList<ITimeBooking[]>>> {
    try {
      const rs = await axiosRequest.get(`${this._prefixURL}/${id}`, {
        params: onRemoveParams(query),
      });
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async createTimeBooking(
    data: Record<string, any>,
  ): Promise<IBaseResponse<ITimeBooking>> {
    try {
      const rs = await axiosRequest.post(this._prefixURL, data);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async updateTimeBooking(
    id: string,
    data: Record<string, any>,
  ): Promise<IBaseResponse<any>> {
    try {
      const rs = await axiosRequest.put(`${this._prefixURL}/${id}`, data);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async deleteTimeBooking(id: string): Promise<IBaseResponse<any>> {
    try {
      const rs = await axiosRequest.delete(`${this._prefixURL}/${id}`);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default TimeBookingService;

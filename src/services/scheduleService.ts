import axiosRequest from '../plugins/request';
import { IBaseQuery } from '../types/query.types';
import { IBaseResponse, IBaseResponseList } from '../types/response.types';
import { ISchedule } from '../types/schedule.types';
import onRemoveParams from '../utils/functions/on-remove-params';

class ScheduleService {
  private _prefixURL = '/v1/schedule';

  public async getListSchedule(
    id: string,
    query: IBaseQuery,
  ): Promise<IBaseResponse<IBaseResponseList<ISchedule[]>>> {
    try {
      const rs = await axiosRequest.get(`${this._prefixURL}/${id}`, {
        params: onRemoveParams(query),
      });
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async createSchedule(
    data: Record<string, any>,
  ): Promise<IBaseResponse<ISchedule>> {
    try {
      const rs = await axiosRequest.post(this._prefixURL, data);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async updateSchedule(
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

  public async deleteSchedule(id: string): Promise<IBaseResponse<any>> {
    try {
      const rs = await axiosRequest.delete(`${this._prefixURL}/${id}`);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default ScheduleService;

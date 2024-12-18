import axiosRequest from '../plugins/request';
import { ICourtNumber } from '../types/courtNumber.types';
import { IBaseQuery } from '../types/query.types';
import { IBaseResponse, IBaseResponseList } from '../types/response.types';
import onRemoveParams from '../utils/functions/on-remove-params';

class CourtNumberService {
  private _prefixURL = '/v1/court-number';

  public async getListCourtNumber(
    id: string,
    query: IBaseQuery,
  ): Promise<IBaseResponse<IBaseResponseList<ICourtNumber[]>>> {
    try {
      const rs = await axiosRequest.get(`${this._prefixURL}/${id}`, {
        params: onRemoveParams(query),
      });
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async createCourtNumber(
    data: Record<string, any>,
  ): Promise<IBaseResponse<ICourtNumber>> {
    try {
      const rs = await axiosRequest.post(this._prefixURL, data);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async updateCourtNumber(
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

  public async deleteCourtNumber(id: string): Promise<IBaseResponse<any>> {
    try {
      const rs = await axiosRequest.delete(`${this._prefixURL}/${id}`);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default CourtNumberService;

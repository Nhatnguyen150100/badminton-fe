import axiosRequest from '../plugins/request';
import {
  IBadmintonCourt,
  IQueryBadmintonCourtAdmin,
} from '../types/badmintonCourt.types';
import { IBaseQuery } from '../types/query.types';
import { IBaseResponse, IBaseResponseList } from '../types/response.types';
import onRemoveParams from '../utils/functions/on-remove-params';

class BadmintonCourtService {
  private _prefixURL = '/v1/court';

  public async getBadmintonCourtManager(
    id: string,
    query: IBaseQuery,
  ): Promise<IBaseResponse<IBaseResponseList<IBadmintonCourt[]>>> {
    try {
      const rs = await axiosRequest.get(`${this._prefixURL}/manager/${id}`, {
        params: onRemoveParams(query),
      });
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getBadmintonCourtAdmin(
    query: IQueryBadmintonCourtAdmin,
  ): Promise<IBaseResponse<IBaseResponseList<IBadmintonCourt[]>>> {
    try {
      const rs = await axiosRequest.get(`${this._prefixURL}/admin/list-court`, {
        params: onRemoveParams(query),
      });
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getBadmintonCourtPost(
    query: IBaseQuery,
  ): Promise<IBaseResponse<IBaseResponseList<IBadmintonCourt[]>>> {
    try {
      const rs = await axiosRequest.get(this._prefixURL, {
        params: onRemoveParams(query),
      });
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getBadmintonCourtDetail(
    id: string,
  ): Promise<IBaseResponse<IBadmintonCourt>> {
    try {
      const rs = await axiosRequest.get(`${this._prefixURL}/${id}`);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async createBadmintonCourt(
    data: Record<string, any>,
  ): Promise<IBaseResponse<IBadmintonCourt>> {
    try {
      const rs = await axiosRequest.post(this._prefixURL, data);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async updateBadmintonCourt(
    id: string,
    data: Record<string, any>,
  ): Promise<IBaseResponse<IBadmintonCourt>> {
    try {
      const rs = await axiosRequest.put(`${this._prefixURL}/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async updateStatusBadmintonCourt(
    id: string,
    data: Record<string, any>,
  ): Promise<IBaseResponse<IBadmintonCourt>> {
    try {
      const rs = await axiosRequest.put(
        `${this._prefixURL}/status/${id}`,
        data,
      );
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async deleteBadmintonCourt(id: string): Promise<IBaseResponse<any>> {
    try {
      const rs = await axiosRequest.delete(`${this._prefixURL}/${id}`);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default BadmintonCourtService;

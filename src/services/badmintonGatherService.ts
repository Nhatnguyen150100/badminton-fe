import axiosRequest from '../plugins/request';
import { IBadmintonGather } from '../types/badmintonGather.types';
import { IBaseQuery } from '../types/query.types';
import { IBaseResponse, IBaseResponseList } from '../types/response.types';
import onRemoveParams from '../utils/functions/on-remove-params';

class BadmintonGatherService {
  private _prefixURL = '/v1/gather';

  public async createBadmintonGather(
    data: Record<string, any>,
  ): Promise<IBaseResponse<IBadmintonGather>> {
    try {
      const rs = await axiosRequest.post(this._prefixURL, data);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async updateBadmintonGather(
    id: string,
    data: Record<string, any>,
  ): Promise<IBaseResponse<IBadmintonGather>> {
    try {
      const rs = await axiosRequest.put(
        `${this._prefixURL}/${id}`,
        data,
      );
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getBadmintonGatherManager(
    id: string,
    query: IBaseQuery,
  ): Promise<IBaseResponse<IBaseResponseList<IBadmintonGather[]>>> {
    try {
      const rs = await axiosRequest.get(`${this._prefixURL}/list-badminton-gather/${id}`, {
        params: onRemoveParams(query),
      });
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getBadmintonGatherList(
    query: IBaseQuery,
  ): Promise<IBaseResponse<IBaseResponseList<IBadmintonGather[]>>> {
    try {
      const rs = await axiosRequest.get(`${this._prefixURL}/`, {
        params: onRemoveParams(query),
      });
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getBadmintonGatherDetail(
    id: string,
  ): Promise<IBaseResponse<IBadmintonGather>> {
    try {
      const rs = await axiosRequest.get(`${this._prefixURL}/${id}`);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // public async updateBadmintonCourt(
  //   id: string,
  //   data: Record<string, any>,
  // ): Promise<IBaseResponse<IBadmintonCourt>> {
  //   try {
  //     const rs = await axiosRequest.put(`${this._prefixURL}/${id}`, data, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     return Promise.resolve(rs.data);
  //   } catch (error) {
  //     return Promise.reject(error);
  //   }
  // }

  // public async deleteBadmintonCourt(id: string): Promise<IBaseResponse<any>> {
  //   try {
  //     const rs = await axiosRequest.delete(`${this._prefixURL}/${id}`);
  //     return Promise.resolve(rs.data);
  //   } catch (error) {
  //     return Promise.reject(error);
  //   }
  // }
}

export default BadmintonGatherService;

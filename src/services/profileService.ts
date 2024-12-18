import axiosRequest from '../plugins/request';
import { IBaseResponse } from '../types/response.types';
import { IUser } from '../types/user.types';

class ProfileService {
  private _prefixURL = '/v1/profile';

  public async updateProfile(
    id: string,
    data: Record<string, any>,
    options?: any
  ): Promise<IBaseResponse<any>> {
    try {
      const rs = await axiosRequest.put(`${this._prefixURL}/${id}`, data, options);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getProfile(
    id: string,
  ): Promise<IBaseResponse<IUser>> {
    try {
      const rs = await axiosRequest.get(`${this._prefixURL}/${id}`);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default ProfileService;

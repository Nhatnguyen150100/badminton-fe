import axiosRequest from '../plugins/request';
import { ILogin, IResponseLogin } from '../types/auth.tyes';
import { IBaseResponse } from '../types/response.types';

class AuthService {
  private _prefixURL = '/v1/auth';

  public async login(data: ILogin): Promise<IBaseResponse<IResponseLogin>> {
    try {
      const rs = await axiosRequest.post(`${this._prefixURL}/login`, data);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async register(data: ILogin): Promise<IBaseResponse<any>> {
    try {
      const rs = await axiosRequest.post(`${this._prefixURL}/register`, data);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default AuthService;

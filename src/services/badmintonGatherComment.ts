import axiosRequest from '../plugins/request';
import { IBadmintonGather } from '../types/badmintonGather.types';
import { IBaseQuery } from '../types/query.types';
import { IBaseResponse, IBaseResponseList } from '../types/response.types';
import onRemoveParams from '../utils/functions/on-remove-params';

class BadmintonGatherCommentService {
  private _prefixURL = '/v1/gather-comment';

  public async createBadmintonGatherComment(
    data: Record<string, any>,
  ): Promise<IBaseResponse<IBadmintonGather>> {
    try {
      const rs = await axiosRequest.post(this._prefixURL, data);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getBadmintonGatherComment(
    id: string,
    query: IBaseQuery,
  ): Promise<IBaseResponse<IBaseResponseList<IBadmintonGather[]>>> {
    try {
      const rs = await axiosRequest.get(
        `${this._prefixURL}/list-badminton-gather/${id}`,
        {
          params: onRemoveParams(query),
        },
      );
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default BadmintonGatherCommentService;

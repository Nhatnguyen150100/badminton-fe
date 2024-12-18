import axiosRequest from '../plugins/request';
import { IBaseResponse, IBaseResponseList } from '../types/response.types';
import { ITransactionHistory } from '../types/transactionHistory.types';
import onRemoveParams from '../utils/functions/on-remove-params';

class TransactionHistoryService {
  private _prefixURL = '/v1/transaction-history';

  public async getTransactionHistory(
    query: Record<string, any>,
  ): Promise<IBaseResponse<IBaseResponseList<ITransactionHistory[]>>> {
    try {
      const rs = await axiosRequest.get(this._prefixURL, {
        params: onRemoveParams(query),
      });
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default new TransactionHistoryService();

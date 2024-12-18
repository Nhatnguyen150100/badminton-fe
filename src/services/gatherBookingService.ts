import axiosRequest from "../plugins/request";
import { IGatherBooking } from "../types/gatherBooking.types";
import { IBaseResponse } from "../types/response.types";

class GatherBookingService {
  private _prefixURL = '/v1/gather-booking';

  public async createGatherBooking(
    data: Record<string, any>,
  ): Promise<IBaseResponse<IGatherBooking>> {
    try {
      const rs = await axiosRequest.post(this._prefixURL, data);
      return Promise.resolve(rs.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default GatherBookingService;
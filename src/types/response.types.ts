type IStatusResponse = 200 | 400;

export interface IBaseResponse<T> {
  data: T;
  message: string;
  status: IStatusResponse;
}

export interface IBaseResponseList<T> {
  content: T;
  totalCount: number;
}

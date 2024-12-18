export interface IBaseQuery {
  page?: number;
  limit?: number;
  nameLike?: string;
  total?: number;
  [key: string]: any;
}

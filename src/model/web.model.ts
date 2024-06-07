export class WebResponse<T> {
  data?: T;
  errors?: string;
  paging?: {
    currentPage: number;
    totalPage: number;
    size: number;
  };
}

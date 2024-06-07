export class WebResponse<T> {
  data?: T;
  errors?: string;
  paging?: Paging;
}

class Paging {
  currentPage: number;
  totalPage: number;
  size: number;
}

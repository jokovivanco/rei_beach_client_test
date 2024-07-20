export type Paging = {
  size: number;
  total_page: number;
  current_page: number;
  isNext: boolean;
};

export type CursorPaging = {
  cursor?: number;
  hasMore: boolean;
};

export type Pageable<T> = {
  data: Array<T>;
  paging: Paging;
};

export type CursorPageable<T> = {
  data: Array<T>;
  paging: CursorPaging;
};

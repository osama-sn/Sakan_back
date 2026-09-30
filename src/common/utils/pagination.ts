export interface PaginationQuery {
  page?: string | number;
  limit?: string | number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const getPaginationParams = (query: PaginationQuery): PaginationParams => {
  const parsedPage = typeof query.page === "string" ? parseInt(query.page, 10) : Number(query.page);
  const parsedLimit = typeof query.limit === "string" ? parseInt(query.limit, 10) : Number(query.limit);

  const page = !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  let limit = !isNaN(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10;

  // Maximum limit is 50
  if (limit > 50) {
    limit = 50;
  }

  const skip = (page - 1) * limit;
  const take = limit;

  return {
    page,
    limit,
    skip,
    take
  };
};

export const buildPaginationMeta = (
  totalItems: number,
  page: number,
  limit: number
): PaginationMeta => {
  const totalPages = Math.ceil(totalItems / limit) || 1;

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
};

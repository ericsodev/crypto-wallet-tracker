import Database from 'bun:sqlite';
import { StringReference } from 'kysely';
import { SelectQueryBuilder } from 'kysely';

export interface PaginationParameters {
  pageSize: number;
  page: number;
  sortDirection: 'asc' | 'desc';
}

export interface PaginationMetadata {
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const getPaginationParameters = async (
  qb: SelectQueryBuilder<Database, keyof Database, unknown>,
  params: PaginationParameters,
): Promise<PaginationMetadata> => {
  const { totalCount: totalCountString } = await qb
    .clearSelect()
    .clearOffset()
    .clearOrderBy()
    .clearLimit()
    .clearGroupBy()
    .select(eb => eb.fn.countAll().$castTo<string>().as('totalCount'))
    .executeTakeFirstOrThrow();

  const totalCount = Number(totalCountString);

  return {
    totalCount,
    currentPage: params.page,
    totalPages: Math.ceil(totalCount / params.pageSize),
  };
};

export const addPaginationFilter = <DB, TB extends keyof DB, O>(
  qb: SelectQueryBuilder<DB, TB, O>,
  params: PaginationParameters,
  sortColumn: StringReference<DB, TB>,
): SelectQueryBuilder<DB, TB, O> => {
  return qb
    .orderBy(sortColumn, params.sortDirection)
    .limit(params.pageSize)
    .offset(params.pageSize * (params.page - 1));
};

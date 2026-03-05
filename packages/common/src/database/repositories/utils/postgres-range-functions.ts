import { OperandExpression } from 'kysely';
import { sql } from 'kysely';
import { Expression } from 'kysely';

export const postgresTsRange = (
  start: Expression<Date | null>,
  end: Expression<Date | null>,
  bounds = '[]',
): OperandExpression<Date | null> => {
  return sql`tstzrange(${start}, ${end}, ${bounds})`;
};

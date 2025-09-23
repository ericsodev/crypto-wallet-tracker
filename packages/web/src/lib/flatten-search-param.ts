export const flattenSearchParam = (value: string | string[] | undefined): string | undefined => {
  if (!value) return value;
  if (typeof value === 'string') return value;

  return value.join();
};

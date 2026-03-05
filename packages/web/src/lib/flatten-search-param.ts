export const flattenSearchParam = (value: string | string[] | undefined): string | undefined => {
  if (!value) return value;
  if (typeof value === 'string') return value;

  return value.join();
};

export const flattenSearchParamObject = (
  searchParams: Record<string, string | string[] | undefined>,
): Record<string, string | undefined> => {
  return Object.fromEntries(Object.entries(searchParams).map(([k, v]) => [k, flattenSearchParam(v)]));
};

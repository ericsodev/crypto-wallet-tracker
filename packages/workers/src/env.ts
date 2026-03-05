import z from 'zod';

const redisEnvironmentConfig = z.object({
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.coerce.number().min(0),
});

const etherScanEnvironmentConfig = z.object({
  ETHERSCAN_API_KEY: z.string().min(1),
});

export const environmentConfigSchema = redisEnvironmentConfig.extend(etherScanEnvironmentConfig.shape);
export type WorkerEnvironment = z.infer<typeof environmentConfigSchema>;

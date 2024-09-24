export function bullmqConfig() {
  return {
    bullmq: {
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT as string),
        password: process.env.REDIS_PASSWORD,
      },
      defaultJobOptions: {
        removeOnComplete: true,
      },
    },
  };
}

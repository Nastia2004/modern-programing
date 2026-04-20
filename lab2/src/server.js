import { buildApp } from './app.js';

const start = async () => {
  const fastify = await buildApp();

  try {
    const port = Number(process.env.PORT) || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();

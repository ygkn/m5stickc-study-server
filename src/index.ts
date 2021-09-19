import fastify from 'fastify';
import { env } from './env';

const server = fastify();

env(server);

server.get('/', async () => {
  return 'Hello!\n';
});

server.put(
  '/acceleration',
  {
    schema: {
      body: {},
    },
  },
  async (request) => {
    console.log(request.body);
    return 'OK';
  }
);

(async () => {
  await server.ready();

  server.listen(
    { port: server.config.PORT, host: server.config.HOST },
    (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      console.log(`Server listening at ${address}`);
    }
  );
})();

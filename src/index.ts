import fastify from 'fastify';
import fastifyWebsocket from 'fastify-websocket';
import WebSocket from 'ws';
import { env } from './env';

const server = fastify();

env(server);

server.register(fastifyWebsocket);

server.get('/', async () => {
  return 'Hello!\n';
});

const socketSet = new Set<WebSocket>();
let lastAcceleration: unknown = null;

server.put(
  '/acceleration',
  {
    schema: {
      body: {},
    },
  },
  async (request) => {
    console.log('[PUT]', request.body);
    lastAcceleration = request.body;
    socketSet.forEach((socket) => {
      socket.send(JSON.stringify(lastAcceleration));
    });
    return 'OK';
  }
);

server.route({
  method: 'GET',
  url: '/acceleration',
  async handler() {
    return lastAcceleration;
  },
  async wsHandler(connection) {
    connection.setEncoding('utf8');

    const { socket } = connection;

    socket.send(JSON.stringify(lastAcceleration));

    socketSet.add(socket);
    socket.on('close', () => {
      socketSet.delete(socket);
    });
  },
});

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

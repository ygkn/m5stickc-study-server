import { JTDDataType } from 'ajv/dist/jtd';
import { FastifyInstance } from 'fastify';
import fastifyEnv from 'fastify-env';
import path from 'path';

const schema = {
  type: 'object',
  required: ['PORT'],
  properties: {
    HOST: {
      type: 'string',
    },
    PORT: {
      type: 'number',
      default: 8080,
    },
  },
} as const;

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      HOST: string;
      PORT: number;
    };
  }
}

export const env = (server: FastifyInstance) => {
  server.register(fastifyEnv, {
    dotenv: {
      path: path.resolve(__dirname, '..', '.env'),
    },
    schema,
  });
};

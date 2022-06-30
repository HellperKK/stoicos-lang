/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import fastify from 'fastify';
import FunToken from '../tokens/FunToken';
import VarManager from '../manager/VarManager';
import BaseToken from '../tokens/BaseToken';
import StructToken from '../tokens/StructToken';

const serverInit = () => {
  const module = new Map<string, BaseToken>();

  const Fastify = fastify({ logger: true });

  // Building functions
  module.set(
    'start',
    FunToken.native((_toks) => {
      // Declare a route
      Fastify.get('/', async (_request, _reply) => {
        return { hello: 'world' };
      });

      // Run the server!
      const start = async () => {
        try {
          await Fastify.listen(3000);
        } catch (err) {
          Fastify.log.error(err);
          process.exit(1);
        }
      };

      start();

      return VarManager.unit;
    })
  );
  return new StructToken(module);
};

export default serverInit;

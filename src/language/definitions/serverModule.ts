/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServer, RequestListener } from 'http';
import FunToken from '../tokens/FunToken';
import VarManager from '../manager/VarManager';
import BaseToken from '../tokens/BaseToken';
import StructToken from '../tokens/StructToken';

const serverInit = () => {
  const module = new Map<string, BaseToken>();

  const host = 'localhost';
  const port = 8000;

  const requestListener: RequestListener = (_req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, World!\n');
  };

  // Building functions
  module.set(
    'start',
    FunToken.native((_toks) => {
      const server = createServer(requestListener);
      server.listen(port, host, () => {
        VarManager.stdOut.content += `Server is running on http://${host}:${port}`;
      });
      return VarManager.unit;
    })
  );
  return new StructToken(module);
};

export default serverInit;

import dotenv from 'dotenv';
import express from 'express';
import serve from 'serve-static';
import compression from 'compression';
import { Store } from 'svelte/store.js';
import http from 'http';
import bodyParser from 'body-parser';
import * as sapper from '../__sapper__/server.js';

const IS_DEV = process.env.NODE_ENV === 'development';

dotenv.config();

const app = express();

[
  'Icon',
  'Icon/assets',
  'Brands',
  'Range/example',
  'Sprite/example',
  'QRCode/example',
].forEach(path => {
  const p = `${process.cwd()}/mamba-sdk/packages/components/${path}`;
  app.use(serve(p, { dotfiles: 'ignore', etag: false }));
})

app.use(
  bodyParser.json({ limit: '300kb' }),
  compression({ threshold: 0 }),
  serve('static'),
  sapper.middleware({
    store: () =>
      new Store({
        guide_contents: [],
      }),
  }),
);

const envPort = IS_DEV ? 3000 : process.env.PORT || 8080;
const host = process.env.HOST || '127.0.0.1';

const httpServer = http.createServer(app, host);
httpServer.listen(envPort);

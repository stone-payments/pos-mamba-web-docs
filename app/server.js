import dotenv from 'dotenv';
import express from 'express';
import sapper from 'sapper';
import serve from 'serve-static';
import compression from 'compression';
import { Store } from 'svelte/store.js';
import { manifest } from './manifest/server.js';

dotenv.config();

const app = express();

app
  .use(
    compression({ threshold: 0 }),
    serve('assets'),
    sapper({
      manifest,
      store: req => {
        return new Store({
          guide_contents: [],
        })
      },
    }),
  )
  .listen(process.env.PORT);

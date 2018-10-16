import dotenv from "dotenv";
import express from "express";
import sapper from "sapper";
import serve from "serve-static";
import compression from "compression";
import { Store } from "svelte/store.js";
import { manifest } from "./manifest/server.js";
import http from "http";
import https from "https";
import fs from "fs";

dotenv.config();

const app = express();

app.use(
  compression({ threshold: 0 }),
  serve("public"),
  sapper({
    manifest,
    store: req => {
      return new Store({
        guide_contents: []
      });
    }
  })
);

if (process.env.NODE_ENV==='development') {
  app.listen(3000);
} else {
  const privateKey = fs.readFileSync("/home/deployusr/cert/_.stone.com.br.key");

  const certificate = fs.readFileSync(
    "/home/deployusr/cert/_.stone.com.br.crt"
  );

  const ca = [
    fs.readFileSync("/home/deployusr/cert/gd_bundle-g2-g1.crt"),
    fs.readFileSync("/home/deployusr/cert/be94a68b8af575bd.crt")
  ];

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca,
  };

  const httpServer = http.createServer(app);

  const httpsServer = https.createServer(credentials, app);

  httpServer.listen(80);

  httpsServer.listen(443);
}

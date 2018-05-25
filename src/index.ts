import * as Koa from 'koa';
import * as http from 'http';
import { createSocketServer } from './net/socket';

const port = process.env.PORT || 8080;

const instance = new Koa();
const server = http.createServer(instance.callback());
createSocketServer(server);

server.listen(port);
console.log(`server listening at port ${port}`);

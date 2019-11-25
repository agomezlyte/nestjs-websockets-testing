import { INestApplication } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { Test } from '@nestjs/testing';
import * as io from "socket.io-client";
import { UserGateway } from '../src/gateway/user.getaway';


async function createNestApp(...gateways): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    providers: gateways,
  }).compile();
  const app = await testingModule.createNestApplication();
  app.useWebSocketAdapter(new WsAdapter(app) as any);
  return app;
}

describe('WebSocketGateway (WsAdapter)', () => {
  let ws, app;

  it(`should handle message (2nd port)`, async () => {
    app = await createNestApp(UserGateway);
    await app.listenAsync(3000);

    let baseAddress = "http://localhost:3000";
    ws = io.connect(baseAddress, {transports:["websocket"]});

    ws.emit('hello', "I'm the first user");
    await new Promise(resolve =>
      ws.on('message', msg => {
        console.log("Hello recieved");
        expect(JSON.parse(msg).data).toBe(true);
        resolve();
      }),
    );
  });
  afterEach(() => app.close());
});

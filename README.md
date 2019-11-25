# nestjs-websockets-testing

Run:

```
npm install
```

then

```
npm run test
```

# Issue
## Bug Report

## Current behavior
Websocket client (Socket.io-client) doesn't connects properly with websocket server on e2e tests. The connection is established but the socket.id is always undefined in both server and client side.

## Input Code
### Main
```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listenAsync(3000);
}
bootstrap();
```

### User Gateway
```ts
import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayDisconnect,
    OnGatewayConnection,
    WsResponse
} from "@nestjs/websockets";
import { Client, Server } from "socket.io";
import { Observable, of } from "rxjs";


@WebSocketGateway()
export class UserGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection{

    @WebSocketServer()
    private server: Server;

    private client: Client;

    public constructor(
    ) { }

    public afterInit() {
        console.log("WS initialized");
    }

    public handleDisconnect(client: Client) {
        console.log("Client " + client.id + " has disconnected");
    }

    public handleConnection(client: Client) {
        console.log("Client " + client.id + " has connected");
    }

    @SubscribeMessage("hello")
    private sayHello(client: Client, msg: string): Observable<WsResponse<boolean>> {
        console.log("Client " + client.id + " says " + msg);
        return of({ event: "hello", data: true });
    }
}
```

### Test

```ts
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
```


## Expected behavior
Test should succed and server side should print:
```
WS initialized

Client SADA5UQEWO8--! has connected

Client SADA5UQEWO8--! says I'm the first user
```

instead, test fails with timeout and server side prints:
```
WS initialized

Client undefined has connected
```

I've tried multiple ways of connecting the socket.io-client and the only one which lets me connect is declaring in connection options:
```
 {transports:["websocket"]}
```
All the other test solution doesn't even connect. Server only prints:
```
WS initialized
```

## Environment

<pre><code>
### Nest
"@nestjs/common": "6.0.0"
"@nestjs/core": "6.0.0"
"@nestjs/platform-express": "6.0.0"
"@nestjs/platform-socket.io": "6.5.3"
"@nestjs/platform-ws": "6.10.1"
"@nestjs/websockets": "6.5.3"
 
For Tooling issues:
- Node version: 10.17.0
- ts-node: 8.1.0
- Platform:  Ubuntu 18

Others:
The code is a minimum project to show the problem. Full project here:



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
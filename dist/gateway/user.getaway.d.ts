import { OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection } from "@nestjs/websockets";
import { Client } from "socket.io";
export declare class UserGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
    private server;
    private client;
    constructor();
    afterInit(): void;
    handleDisconnect(client: Client): void;
    handleConnection(client: Client): void;
    private sayHello;
}

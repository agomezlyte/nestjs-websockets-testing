"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const websockets_1 = require("@nestjs/websockets");
const rxjs_1 = require("rxjs");
let UserGateway = class UserGateway {
    constructor() { }
    afterInit() {
        console.log("WS initialized");
    }
    handleDisconnect(client) {
        console.log("Client " + client.id + " has disconnected");
    }
    handleConnection(client) {
        console.log("Client " + client.id + " has connected");
    }
    sayHello(client, msg) {
        console.log("Client " + client.id + " says " + msg);
        return rxjs_1.of({ event: "hello", data: true });
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", Object)
], UserGateway.prototype, "server", void 0);
__decorate([
    websockets_1.SubscribeMessage("hello"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserGateway.prototype, "sayHello", null);
UserGateway = __decorate([
    websockets_1.WebSocketGateway(),
    __metadata("design:paramtypes", [])
], UserGateway);
exports.UserGateway = UserGateway;
//# sourceMappingURL=user.getaway.js.map
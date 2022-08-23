import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { MessagesWsService } from './messages-ws.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {


  @WebSocketServer() wss: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) { }

  async handleConnection(client: Socket) {

    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token) as JwtPayload;
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
    
  }
  handleDisconnect(client: Socket) {
    // console.log('client disconnected', client.id);
    this.messagesWsService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  // message-from-client
  @SubscribeMessage('message-from-client') 
  handleMessage(client: Socket, payload: NewMessageDto) {
  //! Emit only to the client that sent the message
  // client.emit('message-from-server', payload);

  //! Emit to all clients connected to the server except the client that sent the message
  // client.broadcast.emit('message-from-server', payload);

  //! Emit to all clients connected to the server
  this.wss.emit('message-from-server', {
    fullName: this.messagesWsService.getUserFullName(client.id),
    message: payload.message,
  });

}





}

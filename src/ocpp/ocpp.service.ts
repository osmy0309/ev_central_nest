import { RPCServer, createRPCError, RPCClient } from 'ocpp-rpc';
import { Injectable } from '@nestjs/common';
import { ChargeService } from '../charge/charge.service';
import { CardService } from '../card/card.service';
import { TransactionService } from '../transaction/transaction.service';
import { v4 } from 'uuid';
@Injectable()
export class OcppService {
  constructor(
    private readonly chargeService: ChargeService,
    private readonly cardService: CardService,
    private readonly transactionService: TransactionService,
  ) {}

  public async startServer() {
    console.log('Create Server OCPP...');
    const server = new RPCServer({
      protocols: ['ocpp1.6'], // server accepts ocpp1.6 subprotocol
      strictMode: false, // enable strict validation of requests & responses
    });

    server.auth((accept, reject, handshake) => {
      // accept the incoming client
      accept({
        // anything passed to accept() will be attached as a 'session' property of the client.
        sessionId: handshake.identity,
      });
    });

    server.on('client', async (client) => {
      client.on('Request', (command) => {
        console.log('HERE-----------------------------------------');
        console.log(`Llamada realizada: ${command.action}`);
      });

      client.on('disconnect', () => {
        console.log(`${client.identity} disconnected!`);
        // Aquí puedes agregar la lógica para manejar la desconexión del sistema central
        // y realizar cualquier acción necesaria en función de los parámetros recibidos.
      });

      console.log(`${client.session.sessionId} connected!`); // `XYZ123 connected!`

      // create a specific handler for handling BootNotification requests
      client.handle('BootNotification', ({ params }) => {
        console.log(
          `Server got BootNotification from ${client.identity}:`,
          params,
        );

        // respond to accept the client
        return {
          status: 'Accepted',
          interval: 6000,
          currentTime: new Date().toISOString(),
        };
      });

      client.handle('Authorize', async (params) => {
        console.log('Parametro AUTORIZACION: ', params);
        // create a wildcard handler to handle any RPC method
        const card = await this.cardService.getChargeBySerial(
          params.params.idTag,
        );
        // Verify the idTag and respond with an appropriate response
        if (card) {
          console.log('CARD', card);
          return {
            idTagInfo: {
              status: 'Accepted',
              expiryDate: '2023-07-31T12:00:00.000Z',
              parentIdTag: '',
            },
          };
        } else {
          return {
            idTagInfo: {
              status: 'Invalid',
              expiryDate: null,
              parentIdTag: '',
            },
          };
        }
      });

      client.handle('RemoteStartTransaction', async (objet) => {
        console.log(
          `Server got RemoteStartTransaction from ${client.identity}:`,
          objet.params,
        );
        const card = await this.cardService.getChargeBySerial(
          objet.params.idTag,
        );
        const idTransaction = v4();

        // Verify the idTag and respond with an appropriate response
        if (card) {
          return {
            transactionId: idTransaction,
            idTagInfo: {
              status: 'Accepted',
              expiryDate: '2023-07-31T12:00:00.000Z',
              parentIdTag: '',
            },
          };
        } else {
          throw createRPCError('AuthorizationFailed', 'Invalid idTag');
        }
      });

      client.handle('MeterValues', (objet) => {
        console.log(
          `Server got MeterValues from ${client.identity}:`,
          objet.params,
        );

        // Procesar los valores del medidor recibidos y realizar las acciones necesarias
        // ...

        // Responder con una respuesta apropiada
        return {
          status: 'Accepted',
        };
      });

      client.handle('StartTransaction', async (objet) => {
        console.log(
          `Server got StartTransaction from ${client.identity}:`,
          objet.params,
        );
        const idTransaction = v4();
        const card = await this.cardService.getChargeBySerial(
          objet.params.idTag,
        );
        // Verify the idTag and respond with an appropriate response
        if (card) {
          return {
            transactionId: idTransaction,
            idTagInfo: {
              status: 'Accepted',
              expiryDate: '2023-07-31T12:00:00.000Z',
              parentIdTag: '',
            },
          };
        } else {
          throw createRPCError('AuthorizationFailed', 'Invalid idTag');
        }
      });

      client.handle('StopTransaction', ({ params }) => {
        console.log(
          `Server got StopTransaction from ${client.identity}:`,
          params,
        );

        // Aquí puedes agregar la lógica para manejar la solicitud StopTransaction
        // y realizar cualquier acción necesaria en función de los parámetros recibidos.
        return {
          transactionId: params.transactionId,
          idTagInfo: {
            status: 'Accepted',
            expiryDate: '2023-07-31T12:00:00.000Z',
          },
        };
      });

      // create a specific handler for handling Heartbeat requests
      client.handle('Heartbeat', ({ params }) => {
        console.log(`Server got Heartbeat from ${client.identity}:`, params);

        // respond with the server's current time.
        return {
          currentTime: new Date().toISOString(),
        };
      });

      // create a specific handler for handling StatusNotification requests
      client.handle('StatusNotification', ({ params }) => {
        console.log(
          `Server got StatusNotification from ${client.identity}:`,
          params,
        );

        if (params.status == 'Available') {
          console.log('Available', params);
        }
      });

      client.handle('DataTransfer', (objet) => {
        console.log(
          `Server got DataTransfer from ${client.identity}:`,
          objet.params,
        );

        // Procesar la transferencia de datos recibida y realizar las acciones necesarias
        // ...

        // Responder con una respuesta apropiada
        return {
          status: 'Accepted',
        };
      });

      // create a wildcard handler to handle any RPC method
      client.handle(({ method, params }) => {
        // This handler will be called if the incoming method cannot be handled elsewhere.
        console.log(`Server got ${method} from ${client.identity}:`, params);

        // throw an RPC error to inform the server that we don't understand the request.
        throw createRPCError('NotImplemented');
      });
    });

    async function startServer() {
      console.log('Connected to Server OCPP...');
      await server.listen(3100);
      console.log('Server OCPP listening on port 3100');
    }

    startServer();
  }
}

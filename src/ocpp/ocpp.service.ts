import { RPCServer, createRPCError, RPCClient } from 'ocpp-rpc';
import { Injectable } from '@nestjs/common';
import { ChargeService } from '../charge/charge.service';
import { CardService } from '../card/card.service';
import { TransactionService } from '../transaction/transaction.service';
import { v4 } from 'uuid';
import { async } from 'rxjs';
@Injectable()
export class OcppService {
  constructor(
    private readonly chargeService: ChargeService,
    private readonly cardService: CardService,
    private readonly transactionService: TransactionService,
  ) {}

  async startServer() {
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
          interval: 300,
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

        let response = {};

        /*if (params.status == 'Available') {
          const ocppClient = new RPCClient({
            endpoint: 'ws://127.0.0.1:3100',
            identity: client.session.sessionId,
            protocols: ['ocpp1.6'],
            strictMode: false,
          });
          ocppClient.connect().then(async () => {
            response = await this.clientOcppService.authorizeTransaction(
              ocppClient,
            );
            console.log('RESPONSE', response);
          });
        }*/
        const { connectorId, status } = params;
        return response;
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

  async startClient() {
    const cli = new RPCClient({
      endpoint: 'ws://localhost:3100', // the OCPP endpoint URL
      identity: 'EXAMPLE', // the OCPP identity
      protocols: ['ocpp1.6'], // client understands ocpp1.6 subprotocol
      strictMode: true, // enable strict validation of requests & responses
    });

    // connect to the OCPP server
    await cli.connect();

    // send a BootNotification request and await the response
    const bootResponse = await cli.call('BootNotification', {
      chargePointVendor: 'ocpp-rpc',
      chargePointModel: 'ocpp-rpc',
    });

    // check that the server accepted the client
    if (bootResponse.status === 'Accepted') {
      // send a Heartbeat request and await the response
      const heartbeatResponse = await cli.call('Heartbeat', {});
      // read the current server time from the response
      console.log('Server time is:', heartbeatResponse.currentTime);

      // send a StatusNotification request for the controller

      await cli
        .call('StatusNotification', {
          connectorId: 1,
          errorCode: 'NoError',
          status: 'Available',
        })
        .then((result) => {
          console.log('StatusNotification response:', result);
        })
        .catch((err) => {
          console.error('Error sending StatusNotification:', err);
        });

      await cli
        .call('Heartbeat', {})
        .then((result) => {
          console.log('Heartbeat response:', result);
        })
        .catch((err) => {
          console.error('Error sending Heartbeat:', err);
        });

      await cli
        .call('Authorize', {
          idTag: '12345678',
        })
        .then((authorizeResponse) => {
          console.log('Authorize response:', authorizeResponse);
          // Si la autorización es exitosa, enviar solicitud de inicio de transacción
          if (authorizeResponse.idTagInfo.status === 'Accepted') {
            cli
              .call('StartTransaction', {
                connectorId: 1,
                idTag: '12345678',
                meterStart: 0,
                timestamp: new Date().toISOString(),
                reservationId: 0,
                purpose: 'ChargePoint',
              })
              .then((startTransactionResponse) => {
                console.log(
                  'StartTransaction response:',
                  startTransactionResponse,
                );
              })
              .catch((err) => {
                console.error('Error en StartTransaction:', err);
              });
          }
        })
        .catch((err) => {
          console.error('Error en Authorize:', err);
        });
    }
  }
}

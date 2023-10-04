import { RPCServer, createRPCError, RPCClient } from 'ocpp-rpc';
import { Injectable } from '@nestjs/common';
import { ChargeService } from '../charge/charge.service';
import { TimeZoneService } from '../time_zone/time_zone.service';
import { CardService } from '../card/card.service';
import { TransactionService } from '../transaction/transaction.service';
import { v4 } from 'uuid';
import { createCard_ChargerDto } from 'src/charge/dto/card_charge.dto';
import { createTrasactionDto } from 'src/transaction/dto/transaction.dto';
import {
  createTTimeZoneDTO,
  updateTTimeZoneDTO,
} from 'src/time_zone/dto/time_zone.dto';
@Injectable()
export class OcppService {
  constructor(
    private readonly chargeService: ChargeService,
    private readonly cardService: CardService,
    private readonly timeZoneService: TimeZoneService,
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
      let clientconection = client.session.sessionId;
      let startTransactionStatus = {};
      startTransactionStatus[clientconection] = false;
      client.on('Request', (command) => {
        console.log('HERE-----------------------------------------');
        console.log(`Llamada realizada: ${command.action}`);
      });

      client.on('disconnect', () => {
        console.log(`${client.identity} disconnected!`);
        // Aquí puedes agregar la lógica para manejar la desconexión del sistema central
        // y realizar cualquier acción necesaria en función de los parámetros recibidos.
      });

      console.log(`${client.session.sessionId} connected!`);

      /* server.handle('ChangeAvailability', async (client, command) => {
        console.log(
          `Server received ChangeAvailability from ${client.session.sessionId}:`,
          command.payload,
        );

        // Obtener los parámetros del comando
        const { connectorId, type } = command.payload;

        // Aquí puedes realizar la lógica para habilitar o deshabilitar automáticamente el cargador
        if (type === 'Operative') {
          // Lógica para habilitar el cargador con el ID de conector proporcionado
          // Por ejemplo, enviar una señal para habilitar el cargador o realizar cualquier otra acción necesaria
        } else if (type === 'Inoperative') {
          // Lógica para deshabilitar el cargador con el ID de conector proporcionado
          // Por ejemplo, enviar una señal para deshabilitar el cargador o realizar cualquier otra acción necesaria
        }

        // Responder con una respuesta adecuada
        const response = {
          status: 'Accepted',
        };
        return response;
      });*/

      // create a specific handler for handling BootNotification requests
      client.handle('BootNotification', async ({ params }) => {
        console.log(
          `Server got BootNotification from ${client.identity}:`,
          params,
        );

        const charge = await this.chargeService.getChargeBySerial(
          client.identity,
        );
        // create a wildcard handler to handle any RPC method
        if (charge.id) {
          // Verify the idTag and respond with an appropriate response

          return {
            status: 'Accepted',
            interval: 6000,
            currentTime: new Date().toISOString(),
          };
        } else {
          return {
            status: 'Rejected',
            interval: 6000,
            currentTime: '',
          };
        }
      });

      client.handle('Authorize', async (params) => {
        console.log(
          'Parametro AUTORIZACION: ',
          params,
          'Client:',
          client.identity,
        );
        let flagChangeSon = true;
        const charge = await this.chargeService.getChargeBySerial(
          client.identity,
        );
        // create a wildcard handler to handle any RPC method
        const card = await this.cardService.getChargeBySerial(
          params.params.idTag,
        );
        if (card && charge.id) {
          if (charge.client.id != card.company.id && card) {
            flagChangeSon = false;
            const sonCharge = await this.chargeService.companyIsMySon(
              card.company.id,
              charge.client.id,
            );
            if (sonCharge) flagChangeSon = true;
          }

          // Verify the idTag and respond with an appropriate response
          if (card && card.user && charge.id && flagChangeSon) {
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
                status: 'Rejected',
                expiryDate: null,
                parentIdTag: '',
              },
            };
          }
        }
        return {
          idTagInfo: {
            status: 'Rejected',
            expiryDate: null,
            parentIdTag: '',
          },
        };
      });

      client.handle('RemoteStartTransaction', async (objet) => {
        console.log(
          `Server got RemoteStartTransaction from ${client.identity}:`,
          objet.params,
        );
        let flagChangeSon = true;
        const charge = await this.chargeService.getChargeBySerial(
          client.identity,
        );
        // create a wildcard handler to handle any RPC method
        const card = await this.cardService.getChargeBySerial(
          objet.params.idTag,
        );

        if (charge.client.id != card.company.id) {
          flagChangeSon = false;
          const sonCharge = await this.chargeService.companyIsMySon(
            card.company.id,
            charge.client.id,
          );
          if (sonCharge) flagChangeSon = true;
        }
        const idTransaction = v4();

        // Verify the idTag and respond with an appropriate response
        if (card && card.user && charge.id && flagChangeSon) {
          const cardChangeRelations = new createCard_ChargerDto();
          cardChangeRelations.cardId = card.id;
          cardChangeRelations.chargeId = charge.id;
          cardChangeRelations.estado = 1;
          await this.chargeService.newCard_Charge(cardChangeRelations);
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

      client.handle('MeterValues', async (objet) => {
        console.log(
          `Server got MeterValues from ${client.identity}:`,
          objet.params,
        );
        console.log(
          'METERVALUES',
          objet.params.meterValue[0].sampledValue[0].value,
        );

        if (startTransactionStatus[clientconection] == false) {
          return {
            status: 'Rejected',
          };
        }
        const transaction = await this.transactionService.getTransaction(
          objet.params.transactionId,
        );

        const lineZone = await this.timeZoneService.getTimeZoneByIdTransaction(
          transaction.id,
        );

        (lineZone[0].energy = objet.params.meterValue[0].sampledValue[0].value),
          (lineZone[0].deltaEnergy =
            objet.params.meterValue[0].sampledValue[1].value),
          (lineZone[0].finish = objet.params.meterValue[0].timestamp),
          await this.timeZoneService.modifyTimeZone(
            transaction.id,
            lineZone[0],
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
        let flagChangeSon = true;
        const charge = await this.chargeService.getChargeBySerial(
          client.identity,
        );
        // create a wildcard handler to handle any RPC method
        const card = await this.cardService.getChargeBySerial(
          objet.params.idTag,
        );
        if (card && charge.id) {
          await this.chargeService.updateStateChargeGeneral(charge.id, 2);
          if (charge.client.id != card.company.id) {
            flagChangeSon = false;
            const sonCharge = await this.chargeService.companyIsMySon(
              card.company.id,
              charge.client.id,
            );
            if (sonCharge) flagChangeSon = true;
          }
          // const idTransaction = v4();

          // Verify the idTag and respond with an appropriate response

          if (card && card.user && charge.id && flagChangeSon) {
            const cardChangeRelations: createCard_ChargerDto = {
              cardId: card.id,
              chargeId: charge.id,
              estado: 1,
            };
            const transactionDTO: createTrasactionDto = {
              cardId: card.id,
              chargeId: charge.id,
              estado: 2,
            };
            await this.chargeService.newCard_Charge(cardChangeRelations);
            const transactionSussess =
              await this.transactionService.newTransaction(transactionDTO);

            const lineZoneDTO: createTTimeZoneDTO = {
              transaction: transactionSussess,
              energy: 0,
              deltaEnergy: 0,
              finish: objet.params.timestamp,
              start: objet.params.timestamp,
            };

            await this.timeZoneService.newTimeZone(
              transactionSussess.id,
              lineZoneDTO,
            );
            startTransactionStatus[clientconection] = true;
            return {
              transactionId: transactionSussess.id,
              timeStampStart: objet.params.timestamp,
              idTagInfo: {
                status: 'Accepted',
                expiryDate: '2023-07-31T12:00:00.000Z',
                parentIdTag: '',
              },
            };
          } else {
            /*const stopTransactionPayload2 = {
              transactionId: objet.params.transactionId,
              reason: 'Some reason',
            };
            await client.send('StopTransaction', stopTransactionPayload2);*/
            return {
              idTagInfo: {
                status: 'Rejected',
                expiryDate: null,
                parentIdTag: '',
              },
              errorCode: 'AuthorizationFailed',
              errorDescription: 'Invalid idTag',
              preventMeterValue: true,
            };
          }
        } else {
          /*  const stopTransactionPayload2 = {
            transactionId: objet.params.transactionId,
            reason: 'Some reason',
          };
          await client.send('StopTransaction', stopTransactionPayload2);*/
          return {
            idTagInfo: {
              status: 'Rejected',
              expiryDate: null,
              parentIdTag: '',
            },
            errorCode: 'AuthorizationFailed',
            errorDescription: 'Invalid idTag',
            preventMeterValue: true,
          };
        }
      });

      client.handle('StopTransaction', async ({ params }) => {
        const charge = await this.chargeService.getChargeBySerial(
          client.identity,
        );
        await this.chargeService.updateStateChargeGeneral(charge.id, 1);

        console.log(
          `Server got StopTransaction from ${client.identity}:`,
          params,
        );
        console.log(params);
        if (startTransactionStatus[clientconection] == false) {
          return {
            transactionId: params.transactionId,
            idTagInfo: {
              status: 'Accepted',
              expiryDate: '2023-07-31T12:00:00.000Z',
            },
          };
        }
        const transaction = await this.transactionService.getTransaction(
          params.transactionId,
        );
        transaction.estado = 3;
        await this.transactionService.changeStatenewTransaction(transaction);
        const dateFinish = new Date(params.timestamp);

        const lineZone = await this.timeZoneService.getTimeZoneByIdTransaction(
          transaction.id,
        );

        (lineZone[0].energy = params.meterStop),
          (lineZone[0].finish = dateFinish),
          await this.timeZoneService.modifyTimeZone(
            transaction.id,
            lineZone[0],
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
          objet.params.data,
        );

        // Procesar la transferencia de datos recibida y realizar las acciones necesarias
        // ...

        // Responder con una respuesta apropiada
        return {
          status: 'Accepted',
        };
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

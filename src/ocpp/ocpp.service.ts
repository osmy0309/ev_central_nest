import { RPCServer, createRPCError, RPCClient } from 'ocpp-rpc';
import { Injectable } from '@nestjs/common';
import { ChargeService } from '../charge/charge.service';
import { TimeZoneService } from '../time_zone/time_zone.service';
import { CardService } from '../card/card.service';
import { TransactionService } from '../transaction/transaction.service';
import { v4 } from 'uuid';
import { createCard_ChargerDto } from 'src/charge/dto/card_charge.dto';
import { createTrasactionDto } from 'src/transaction/dto/transaction.dto';
import { createTTimeZoneDTO } from 'src/time_zone/dto/time_zone.dto';
import { async } from 'rxjs';

@Injectable()
export class OcppService {
  private instanceId: string;
  private charge = {};
  private connections = {};
  constructor(
    private readonly chargeService: ChargeService,
    private readonly cardService: CardService,
    private readonly timeZoneService: TimeZoneService,
    private readonly transactionService: TransactionService,
  ) {}

  allClients = new Map();

  public async startServer() {
    console.log('Create Server OCPP...');
    const connectedClients = {};
    const server = new RPCServer({
      protocols: ['ocpp1.6'], // server accepts ocpp1.6 subprotocol
      strictMode: false,
      pingIntervalMs: 5 * 60 * 1000, // callTimeoutMs: 3000000, // enable strict validation of requests & responses
    });

    server.auth(async (accept, reject, handshake, other) => {
      //this.conections[handshake.identity]++;
      if (!this.charge[handshake.identity]) {
        this.connections[handshake.identity] = 1;
        this.charge[handshake.identity] =
          await this.chargeService.getChargeBySerial(handshake.identity); // OBTENER DATOS DEL CARGADOR CONECTADO EN LA BD

        // CAMBIAR ESTADO A CONECTADO DEL CARGADOR
        if (this.charge[handshake.identity].id /*&& charge.state != 4*/) {
          await this.chargeService.updateStateChargeGeneral(
            this.charge[handshake.identity].id,
            1,
          );
          //CAMBIAR ESTADO A CONECTADO DE LOS CONECTORES
          await this.chargeService.updateStateConector(
            this.charge[handshake.identity].id,
            null,
            1,
          );
        }
        accept({
          // anything passed to accept() will be attached as a 'session' property of the client.
          sessionId: handshake.identity,
        });
      } else {
        this.connections[handshake.identity]++;
        accept({
          sessionId: handshake.identity,
          //error: 'No se pudo autenticar la conexión',
        });
      }
    });

    server.on('client', async (client) => {
      const chargeidentity = {};
      chargeidentity[client.identity] =
        await this.chargeService.getChargeBySerial(client.identity);

      let clientconection = client.session.sessionId;
      connectedClients[clientconection] = true;
      let startTransactionStatus = {};
      startTransactionStatus[clientconection] = false;

      client.on('Request', (command) => {
        console.log('HERE-----------------------------------------');
        console.log(`Llamada realizada: ${command.action}`);
      });

      console.log(`${client.session.sessionId} connected!`);
      this.allClients.set(client.identity, client); // store client reference

      client.on('disconnect', async (params) => {
        const chargedisconnect = await this.chargeService.getChargeBySerial(
          client.identity,
        );

        if (this.connections[chargedisconnect.serial_number] > 1) {
          this.connections[chargedisconnect.serial_number]--;
        } else {
          this.connections[chargedisconnect.nombre] = {};
          this.connections[chargedisconnect.serial_number] = {};
          if (chargedisconnect.id && chargedisconnect.state != 4) {
            await this.chargeService.updateStateChargeGeneral(
              chargedisconnect.id,
              3,
            );
            //CAMBIAR ESTADO DE LOS CONECTORES A DESCONECTADO
            await this.chargeService.updateStateConector(
              chargedisconnect.id,
              null,
              3,
            );
          }
          delete this.charge[chargedisconnect.serial_number];
        }

        console.log(`${client.identity} disconnected!`);
        //CAMBIAR ESTADO DEL CARGADOR A DESCONECTADO
        if (chargedisconnect.state == 4) {
          delete this.charge[chargedisconnect.nombre];
          //CAMBIAR ESTADO DEL CARGADOR A DESHABILITADO
          await this.chargeService.updateStateChargeGeneral(
            chargedisconnect.id,
            4,
          );
          //CAMBIAR ESTADO DE LOS CONECTORES A DESHABILITADO
          await this.chargeService.updateStateConector(
            chargedisconnect.id,
            null,
            4,
          );
        }
        if (chargedisconnect.state == 2 || chargedisconnect.state == 1) {
          delete this.charge[chargedisconnect.nombre];
          //CAMBIAR ESTADO DEL CARGADOR A DESHABILITADO
          await this.chargeService.updateStateChargeGeneral(
            chargedisconnect.id,
            3,
          );
          this.transactionService;
          //CAMBIAR ESTADO DE LOS CONECTORES A DESHABILITADO
          await this.chargeService.updateStateConector(
            chargedisconnect.id,
            null,
            3,
          );
          await this.transactionService.changeStatenTransactionByCharge(
            chargedisconnect.id,
          );
        }

        delete connectedClients[clientconection];
        // Aquí puedes agregar la lógica para manejar la desconexión del sistema central
        // y realizar cualquier acción necesaria en función de los parámetros recibidos.
      });
      /* client.handle('disconnect', async (params) => {
        console.log(
          "DISCONNECT"
        );
      })*/

      client.handle('ChangeAvailability', ({ params }) => {
        console.log(
          `Server got ChangeAvailability from ${client.identity}:`,
          params,
        );

        const { connectorId, type } = params;

        // Now you have the connectorId and the type of change, you can use them for further processing.
        console.log(`Connector ID: ${connectorId}, Change Type: ${type}`);

        // Here you can implement the logic to change the availability of the connector.

        // respond with the appropriate response
        return {
          status: 'Accepted',
        };
      });

      client.handle('UpdateFirmware', async ({ params }) => {
        console.log(
          `Server got UpdateFirmware from ${client.identity}:`,
          params,
        );

        const { location, retrieveDate, retries, retryInterval } = params;

        // Aquí puedes implementar la lógica para manejar la actualización de firmware,
        // por ejemplo, iniciar el proceso de descarga e instalación del firmware.
        return {
          status: 'Accepted',
        };
      });

      client.handle('FirmwareStatusNotification', ({ status }) => {
        console.log(
          `Firmware Status Notification from ${client.identity} ${status}`,
        );

        return {
          status: 'Accepted',
        };
      });

      client.handle('ChangeAvailability', async (clientparam, command) => {
        console.log(
          `Server received ChangeAvailability from ${clientparam.params}:`,
        );
        /*command.payload.connectorId = client.params.connectorId;
        command.payload.type = client.params.type;*/
        // Obtener los parámetros del comando

        // Aquí puedes realizar la lógica para habilitar o deshabilitar automáticamente el cargador
        if (
          clientparam.params.type === 'Operative' &&
          chargeidentity[client.identity].id
        ) {
          await this.chargeService.updateStateChargeGeneral(
            chargeidentity[client.identity].id,
            3,
          );

          await this.chargeService.updateStateConector(
            chargeidentity[client.identity].id,
            null,
            3,
          );
          await client.disconnect;
          // Lógica para habilitar el cargador con el ID de conector proporcionado
          // Por ejemplo, enviar una señal para habilitar el cargador o realizar cualquier otra acción necesaria
        } else if (
          clientparam.params.type === 'Inoperative' &&
          chargeidentity[client.identity].id
        ) {
          await this.chargeService.updateStateChargeGeneral(
            chargeidentity[client.identity].id,
            4,
          );

          await this.chargeService.updateStateConector(
            chargeidentity[client.identity].id,
            null,
            4,
          );
          await client.disconnect;
          // Lógica para deshabilitar el cargador con el ID de conector proporcionado
          // Por ejemplo, enviar una señal para deshabilitar el cargador o realizar cualquier otra acción necesaria
        }

        // Responder con una respuesta adecuada
        const response = {
          status: 'Accepted',
        };
        return response;
      });

      // create a specific handler for handling BootNotification requests
      client.handle('BootNotification', async ({ params }) => {
        /* if (charge.id && charge.state == 3) {
          const response = await this.chargeService.updateStateChargeGeneral(
            charge.id,
            1,
          );
        }*/
        console.log(`Server got BootNotification from ${params}:`, params);

        // create a wildcard handler to handle any RPC method
        if (
          chargeidentity[client.identity].id &&
          chargeidentity[client.identity].state != 4
        ) {
          // Verify the idTag and respond with an appropriate response

          return {
            status: 'Accepted',
            interval: 300,
            currentTime: new Date().toISOString(),
          };
        } else {
          return {
            status: 'Rejected',
            interval: 300,
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
        // create a wildcard handler to handle any RPC method
        const card = await this.cardService.getChargeBySerial(
          params.params.idTag,
        );
        if (chargeidentity[client.identity].client && card && card.company) {
          if (
            card &&
            chargeidentity[client.identity].id &&
            chargeidentity[client.identity].state != 4
          ) {
            if (
              chargeidentity[client.identity].client.id != card.company.id &&
              card
            ) {
              flagChangeSon = false;
              const sonCharge = await this.chargeService.companyIsMySon(
                card.company.id,
                chargeidentity[client.identity].client.id,
              );
              if (sonCharge) flagChangeSon = true;
            }

            // Verify the idTag and respond with an appropriate response
            if (
              card &&
              card.user &&
              chargeidentity[client.identity].id &&
              flagChangeSon
            ) {
              //   await this.chargeService.updateStateChargeGeneral(charge.id, 5);
              return {
                idTagInfo: {
                  status: 'Accepted',
                  expiryDate: '2032-03-02T12:00:00Z',
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
          }
        }
        return {
          idTagInfo: {
            status: 'Invalid',
            expiryDate: '',
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
        // create a wildcard handler to handle any RPC method
        const card = await this.cardService.getChargeBySerial(
          objet.params.idTag,
        );

        if (chargeidentity[client.identity].client.id != card.company.id) {
          flagChangeSon = false;
          const sonCharge = await this.chargeService.companyIsMySon(
            card.company.id,
            chargeidentity[client.identity].client.id,
          );
          if (sonCharge) flagChangeSon = true;
        }
        const idTransaction = v4();

        // Verify the idTag and respond with an appropriate response
        if (
          card &&
          card.user &&
          chargeidentity[client.identity].id &&
          flagChangeSon
        ) {
          const cardChangeRelations = new createCard_ChargerDto();
          cardChangeRelations.cardId = card.id;
          cardChangeRelations.chargeId = chargeidentity[client.identity].id;
          cardChangeRelations.estado = 1;
          await this.chargeService.newCard_Charge(cardChangeRelations);
          return {
            transactionId: idTransaction,
            idTagInfo: {
              status: 'Accepted',
              expiryDate: '2032-03-02T12:00:00Z',
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
          JSON.stringify(objet.params, null, 2),
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

        // Teoricamente un "meter values" no tiene campos de respuesta
        return {
          //status: 'Accepted',
        };
      });

      client.handle('StartTransaction', async (objet) => {
        console.log(
          `Server got StartTransaction from ${client.identity}:`,
          objet.params,
        );
        try {
          let flagChangeSon = true;
          let conectorId = chargeidentity[client.identity].conector.find(
            (conector) => conector.name == objet.params.connectorId,
            //JSON.stringify(conector.name) ===
            objet.params.connectorId,
          );
          // create a wildcard handler to handle any RPC method
          const card = await this.cardService.getChargeBySerial(
            objet.params.idTag,
          );
          if (
            card &&
            chargeidentity[client.identity].id &&
            chargeidentity[client.identity].state != 4
          ) {
            if (chargeidentity[client.identity].client.id != card.company.id) {
              flagChangeSon = false;
              const sonCharge = await this.chargeService.companyIsMySon(
                card.company.id,
                chargeidentity[client.identity].client.id,
              );
              if (sonCharge) flagChangeSon = true;
            }
            // const idTransaction = v4();

            // Verify the idTag and respond with an appropriate response

            if (
              card &&
              card.user &&
              chargeidentity[client.identity].id &&
              flagChangeSon
            ) {
              await this.chargeService.updateStateChargeGeneral(
                chargeidentity[client.identity].id,
                2,
              );

              await this.chargeService.updateStateConector(
                chargeidentity[client.identity].id,
                conectorId.name,
                2,
              );
              const cardChangeRelations: createCard_ChargerDto = {
                cardId: card.id,
                chargeId: chargeidentity[client.identity].id,
                estado: 1,
              };

              await this.transactionService.changeStatenTransactionByConnector(
                conectorId.id,
              );

              const transactionDTO: createTrasactionDto = {
                cardId: card.id,
                chargeId: chargeidentity[client.identity].id,
                estado: 2,
                userId: card.user.id,
                conectorId: conectorId.id,
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
                conectorId: conectorId.id,
                idTagInfo: {
                  status: 'Accepted',
                  expiryDate: '2032-03-02T12:00:00Z',
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
        } catch (error) {
          console.error(error);
        }
      });

      client.handle('StopTransaction', async ({ params }) => {
        const transaction = await this.transactionService.getTransaction(
          params.transactionId,
        );
        await this.chargeService.updateStateChargeGeneral(
          chargeidentity[client.identity].id,
          1,
        );

        await this.chargeService.updateStateConector(
          chargeidentity[client.identity].id,
          transaction.conector.name,
          1,
        );

        console.log(
          `Server got StopTransaction from ${client.identity}:`,
          params,
        );

        if (startTransactionStatus[clientconection] == false) {
          return {
            transactionId: params.transactionId,
            idTagInfo: {
              status: 'Accepted',
              expiryDate: '2032-03-02T12:00:00Z',
            },
          };
        }

        transaction.estado = 3;
        await this.transactionService.changeStatenewTransaction(transaction);
        const dateFinish = new Date(params.timestamp);

        const lineZone = await this.timeZoneService.getTimeZoneByIdTransaction(
          transaction.id,
        );

        // [2,"2a1d0c75-d210-45a4-b40d-6d913fd78090",
        // "StopTransaction",{"transactionId":2,"timestamp":"2024-01-31T05:40:31.829Z","meterStop":140}]
        //console.log(lineZone);
        //console.log(lineZone[0]);
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
            expiryDate: '2032-03-02T12:00:00Z',
          },
        };
      });

      // create a specific handler for handling Heartbeat requests
      client.handle('Heartbeat', async ({ params }) => {
        console.log(`Server got Heartbeat from ${client.identity}:`, params);
        chargeidentity[client.identity] =
          await this.chargeService.getChargeBySerial(client.identity);
        if (
          chargeidentity[client.identity].id &&
          chargeidentity[client.identity].state == 3
        ) {
          await this.chargeService.updateStateChargeGeneral(
            chargeidentity[client.identity].id,
            1,
          );
          await this.chargeService.updateStateConector(
            chargeidentity[client.identity].id,
            null,
            1,
          );
        }

        if (chargeidentity[client.identity].state == 4) await client.disconnect;
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
        return {};
      });

      client.handle('DataTransfer', async (objet) => {
        console.log(`Server got DataTransfer from ${client.identity}:`, objet);

        // Procesar la transferencia de datos recibida y realizar las acciones necesarias
        // ...

        // Responder con una respuesta apropiada
        if (chargeidentity[client.identity].id) {
          return {
            status: 'Accepted',
          };
        } else {
          return {
            status: 'Rejected',
          };
        }
      });
      // Implementación del controlador por defecto
      client.handle((command) => {
        console.log(
          `Received unknown command ${command.action} from ${client.identity}`,
        );

        // Responder con 'Accepted' por defecto
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

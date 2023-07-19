import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
const { RPCServer, createRPCError, RPCClient } = require('ocpp-rpc');
import { connectDto } from './dto/client_ocpp.dto';
@Injectable()
export class ClientOcppService {
  private cli: any;

  constructor() {}
  async connect(newConnection: connectDto): Promise<any> {
    this.cli = new RPCClient({
      endpoint: 'ws://localhost:3100', // the OCPP endpoint URL
      identity: newConnection.identity, // the OCPP identity
      protocols: ['ocpp1.6'], // client understands ocpp1.6 subprotocol
      strictMode: true, // enable strict validation of requests & responses
    });

    // connect to the OCPP server
    await this.cli.connect();
  }
  //Service Call Heartbeat
  async heartbeat(newConnection: connectDto): Promise<any> {
    if (this.cli) {
      const bootResponse = await this.cli.call('BootNotification', {
        chargePointVendor: 'ocpp-rpc',
        chargePointModel: 'ocpp-rpc',
      });
      if (bootResponse.status === 'Accepted') {
        // send a Heartbeat request and await the response
        const heartbeatResponse = await this.cli.call('Heartbeat', {});
        // read the current server time from the response
        console.log('Server time is:', heartbeatResponse.currentTime);
      }
    } else {
      throw new HttpException('NOT_USER_CONNECTION', 400);
    }
  }

  async statusNotification(newConnection: connectDto): Promise<any> {
    if (this.cli) {
      const bootResponse = await this.cli.call('BootNotification', {
        chargePointVendor: 'ocpp-rpc',
        chargePointModel: 'ocpp-rpc',
      });
      if (bootResponse.status === 'Accepted') {
        await this.cli
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
      }
    } else {
      throw new HttpException('NOT_USER_CONNECTION', 400);
    }
  }

  async authorizeTransaction(newConnection: connectDto): Promise<any> {
    if (this.cli) {
      const bootResponse = await this.cli.call('BootNotification', {
        chargePointVendor: 'ocpp-rpc',
        chargePointModel: 'ocpp-rpc',
      });
      if (bootResponse.status === 'Accepted') {
        await this.cli
          .call('Authorize', {
            idTag: '12345678',
          })
          .then((authorizeResponse) => {
            console.log('Authorize response:', authorizeResponse);
            // Si la autorización es exitosa, enviar solicitud de inicio de transacción
            if (authorizeResponse.idTagInfo.status === 'Accepted') {
              this.cli
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
    } else {
      throw new HttpException('NOT_USER_CONNECTION', 400);
    }
  }
}

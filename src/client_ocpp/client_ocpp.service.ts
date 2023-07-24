import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
const { RPCClient } = require('ocpp-rpc');
import { connectDto } from './dto/client_ocpp.dto';
@Injectable()
export class ClientOcppService {
  private cli: any;
  private autTransaction: boolean = false;

  constructor() {}
  async connect(newConnection: connectDto): Promise<any> {
    this.cli = new RPCClient({
      endpoint: 'ws://localhost:3100', // the OCPP endpoint URL
      identity: newConnection.identity, // the OCPP identity
      protocols: ['ocpp1.6'], // client understands ocpp1.6 subprotocol
      strictMode: false, // enable strict validation of requests & responses
    });

    // connect to the OCPP server
    await this.cli.connect();
    if (this.cli) return { connect: 'on' };
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
        const StatusNotification = await this.cli
          .call('StatusNotification', {
            connectorId: 1,
            errorCode: 'NoError',
            status: 'Available',
          })
          .catch((err) => {
            console.error('Error sending StatusNotification:', err);
          });

        console.log('StatusNotification response:', StatusNotification);
        return { connectorId: 1, errorCode: 'NoError', status: 'Available' };
      }
    } else {
      throw new HttpException('NOT_USER_CONNECTION', 400);
    }
  }

  async authorizeTransaction(ocppClient) {
    // console.log('ÁQUI', ocppClient);
    if (ocppClient) {
      const authorizeResponse = await ocppClient.call(
        'Authorize',
        {
          idTag: '12345678',
          connectorId: 1,
          transactionId: 123,
        },
        '12345678' /* Identidad (idTag) del usuario que está autorizando */,
      );
      console.log('SERVICIO AUTENTICACION', authorizeResponse);
      return authorizeResponse;
      // Si la autorización es exitosa, enviar solicitud de inicio de transacción
      if (authorizeResponse.idTagInfo.status === 'Accepted') {
        console.log('Authorize response:', authorizeResponse);
        const startTransactionResponse = await ocppClient.call(
          'StartTransaction',
          {
            connectorId: 1,
            idTag: '12345678',
            meterStart: 10,
            timestamp: new Date().toISOString(),
            reservationId: 0,
          },
          {
            skipExtraProps: true,
          },
        );
        console.log('StartTransaction response:', startTransactionResponse);
        if (startTransactionResponse.idTagInfo.status == 'Accepted')
          this.autTransaction = true;

        return { startTransactionResponse };
      }
    }
  }

  async stopTransaction(newConnection) {
    console.log('here');
    if (this.cli) {
      const bootResponse = await this.cli.call('BootNotification', {
        chargePointVendor: 'ocpp-rpc',
        chargePointModel: 'ocpp-rpc',
      });
      if (bootResponse.status === 'Accepted') {
        const authorizeResponse = await this.cli.call('Authorize', {
          idTag: '12345678',
        });
        // Si la autorización es exitosa, enviar solicitud de inicio de transacción
        if (authorizeResponse.idTagInfo.status === 'Accepted') {
          console.log('Authorize response:', authorizeResponse);
          const StopTransactionresponse = await this.cli.call(
            'StopTransaction',
            {
              idTag: '12345678',
              meterStop: 10,
              timestamp: new Date().toISOString(),
              transactionId: 1,
            },
          );
          console.log('StopTransaction response:', StopTransactionresponse);
          return { StopTransactionresponse };
        }
      }
    } else {
      throw new HttpException('NOT_USER_CONNECTION', 400);
    }
  }
}

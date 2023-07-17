const { RPCServer, createRPCError, RPCClient } = require('ocpp-rpc');
import { Injectable } from '@nestjs/common';
@Injectable()
export class OcppService {
  constructor() {}

  async startServer() {
    console.log('Create Server OCPP...');
    const server = new RPCServer({
      protocols: ['ocpp1.6'], // server accepts ocpp1.6 subprotocol
      strictMode: true, // enable strict validation of requests & responses
    });

    server.auth((accept, reject, handshake) => {
      // accept the incoming client
      accept({
        // anything passed to accept() will be attached as a 'session' property of the client.
        sessionId: 'XYZ123',
      });
    });

    server.on('client', async (client) => {
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
        return {};
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
      await cli.call('StatusNotification', {
        connectorId: 0,
        errorCode: 'NoError',
        status: 'Available',
      });
    }
  }
}

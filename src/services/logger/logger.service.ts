import { Injectable } from '@nestjs/common';
import { Logger, createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService {
  private loggerLevel1: Logger;
  private loggerLevel2: Logger;
  private loggerLevel3: Logger;
  constructor() {
    this.createLogers();
    this.replaceConsole();
  }

  createLogers() {
    //Formato que queremos en el log
    const textFormat = format.printf((log) => {
      return `${log.timestamp} - [${log.level.toLocaleUpperCase().charAt(0)}] ${
        log.message
      }`;
    });

    const dateFormat = format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    });

    this.loggerLevel1 = createLogger({
      level: 'info',
      format: format.combine(dateFormat, textFormat),
      transports: [
        /*  new transports.DailyRotateFile({
          filename: 'log/level1/level1-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '7d',
        }),*/

        new transports.Console(), //para ver los mensajes en consola
      ],
    });

    this.loggerLevel2 = createLogger({
      level: 'error',
      format: format.combine(dateFormat, textFormat),
      transports: [
        new transports.Console(), //para ver los mensajes en consola
      ],
    });

    this.loggerLevel3 = createLogger({
      level: 'warn',
      format: format.combine(dateFormat, textFormat),
      transports: [
        new transports.Console(), //para ver los mensajes en consola
      ],
    });
  }
  replaceConsole() {
    const logLevel = process.env.LOGS;
    if (logLevel === 'exception') {
      console.log = () => {}; // Deshabilita console.log
      console.warn = () => {}; // Deshabilita console.warn
      console.debug = () => {}; // Deshabilita console.debug
    } else if (logLevel === 'warning') {
      console.log = () => {}; // Deshabilita console.log
      console.debug = () => {}; // Deshabilita console.debug
    } else if (logLevel === 'information') {
      console.debug = () => {}; // Deshabilita console.debug
    }

    if (process.env.LOGS === 'information') {
      console.log = (message, params) => {
        if (params) {
          this.loggerLevel1.info(message + ' ' + JSON.stringify(params));
        } else {
          this.loggerLevel1.info(message);
        }
      };
    }

    console.error = (message, params) => {
      if (params) {
        this.loggerLevel1.error(message + ' ' + JSON.stringify(params));
        this.loggerLevel2.error(message + ' ' + JSON.stringify(params));
        this.loggerLevel3.error(message + ' ' + JSON.stringify(params));
      } else {
        this.loggerLevel1.error(message);
        this.loggerLevel2.error(message);
        this.loggerLevel3.error(message);
      }
    };

    if (process.env.LOGS === 'information' || process.env.LOGS === 'warning') {
      console.warn = (message, params) => {
        if (params) {
          this.loggerLevel1.warn(message + ' ' + JSON.stringify(params));
          this.loggerLevel2.warn(message + ' ' + JSON.stringify(params));
        } else {
          this.loggerLevel1.warn(message);
          this.loggerLevel2.warn(message);
        }
      };
    }
  }
  log(message: string) {
    if (process.env.LOGS === 'information') this.loggerLevel1.info(message);
  }
  error(message: string) {
    if (process.env.LOGS === 'information') this.loggerLevel1.error(message);
    else if (process.env.LOGS === 'warning') {
      this.loggerLevel1.error(message);
      this.loggerLevel2.error(message);
    } else if (process.env.LOGS === 'exeption') {
      this.loggerLevel1.error(message);
      this.loggerLevel2.error(message);
      this.loggerLevel3.error(message);
    }
  }

  warn(message: string) {
    if (process.env.LOGS === 'information') this.loggerLevel1.warn(message);
    else if (process.env.LOGS === 'warning') {
      this.loggerLevel1.warn(message);
      this.loggerLevel2.warn(message);
    }
  }

  debug(message: string) {
    if (process.env.LOGS === 'information') this.loggerLevel1.debug(message);
  }

  verbose(message: string) {
    if (process.env.LOGS === 'information') this.loggerLevel1.verbose(message);
  }
}

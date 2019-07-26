import * as winston from 'winston'
import Elasticsearch, { ElasticsearchTransportOptions } from 'winston-elasticsearch'

const esTransportOpts: ElasticsearchTransportOptions = {
  level: 'info',
}

export const log = winston.createLogger({
  transports: [
    new winston.transports.Console(),
  ],
})

export const guildEventLogger = winston.createLogger({
  transports: [
    new Elasticsearch({ ...esTransportOpts, indexPrefix: 'guild-events' }),
  ],
})

export const queryLogger = winston.createLogger({
  transports: [
    new Elasticsearch({ ...esTransportOpts, indexPrefix: 'queries' }),
  ],
})

export const queryInfoLogger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new Elasticsearch({ ...esTransportOpts, indexPrefix: 'info-queries' }),
  ],
})

export const errorLogger = winston.createLogger({
  transports: [
    new Elasticsearch({ ...esTransportOpts, indexPrefix: 'errors' }),
  ],
})

import * as winston from 'winston'
import Elasticsearch, { ElasticsearchTransportOptions } from 'winston-elasticsearch'

const esTransportOpts: ElasticsearchTransportOptions = {
  level: 'info',
}

export const logger = winston.createLogger({
  transports: [
    new Elasticsearch(esTransportOpts),
  ],
})

export const eventsLogger = winston.createLogger({
  transports: [
    new Elasticsearch({ ...esTransportOpts, index: 'events' }),
  ],
})

export const queryLogger = winston.createLogger({
  transports: [
    new Elasticsearch({ ...esTransportOpts, index: 'queries' }),
  ],
})

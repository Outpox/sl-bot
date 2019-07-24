import * as winston from 'winston'
import Elasticsearch, { ElasticsearchTransportOptions } from 'winston-elasticsearch'

const esTransportOpts: ElasticsearchTransportOptions = {
  level: 'info',
}

export const guildEventsLogger = winston.createLogger({
  transports: [
    new Elasticsearch({ ...esTransportOpts, index: 'events' }),
  ],
})

export const queryLogger = winston.createLogger({
  transports: [
    new Elasticsearch({ ...esTransportOpts, index: 'queries' }),
  ],
})

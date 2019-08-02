import { queryInfoLogger, errorLogger } from './logs'

export enum ERROR_TYPE {
  NOT_FOUND,
  SL_API,
  ITUNES_API,
}

export interface CustomErrorOptions {
  message: string
  errorType: ERROR_TYPE
  queryUuid: string
  originalError?: Error
}

export class CustomError extends Error {
  errorType: ERROR_TYPE
  queryUuid: string

  constructor(options: CustomErrorOptions) {
    super(options.message)
    this.errorType = options.errorType
    this.queryUuid = options.queryUuid

    queryInfoLogger.error(this.message, { queryUuid: this.queryUuid })

    if (options.originalError) {
      errorLogger.error(this.message, { originalError: options.originalError, errorType: this.errorType, queryUuid: this.queryUuid })
    }
  }
}

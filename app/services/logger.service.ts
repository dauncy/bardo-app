import { Logger } from 'tslog'

export interface ILogProps {
  type: 'pretty' | 'json' | 'hidden'
  minLevel: number
  argumentsArrayName: string
}

const DEFAULT_SETTINGS: ILogProps = {
  type: 'pretty',
  minLevel: 1,
  argumentsArrayName: 'arguments',
}

export class LoggerStore {
  static loggers = new Map<string, Logger<ILogProps>>()
  static getLogger(name: string, settings?: ILogProps): Logger<ILogProps> {
    if (!LoggerStore.loggers.has(name)) {
      this.loggers.set(name, new Logger({ name, ...(settings || DEFAULT_SETTINGS) }))
    }
    return this.loggers.get(name)!
  }
}

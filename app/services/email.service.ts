import { Config } from '@app/config/configuration'
import postmark from 'postmark'
import { container } from 'tsyringe'

const config = container.resolve(Config)
export const emailCLient = new postmark.ServerClient(config.postmark.api_key)

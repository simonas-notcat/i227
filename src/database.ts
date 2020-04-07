import { createConnection } from 'typeorm'
import { Entities } from 'daf-core'

export const initDB = async () => {
  await createConnection({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    logging: process.env.DB_DEBUG=='1',
    entities: Entities,
  })
}
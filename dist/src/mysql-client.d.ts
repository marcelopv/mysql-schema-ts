import { Connection } from 'mysql2'
import { Table } from './typescript'
import { SQLStatement } from 'sql-template-strings'
export declare type Enums = {
  [key: string]: string[]
}
export declare function query<T>(conn: Connection, sql: SQLStatement): Promise<T[]>
export declare class MySQL {
  private connection
  private defaultSchema
  constructor(connectionString: string)
  table(tableName: string): Promise<Table>
  allTables(): Promise<
    {
      name: string
      table: Table
    }[]
  >
  private tableNames
  schema(): string
  private enums
  private getTable
}

import { Table } from './typescript'
export declare function inferTable(connectionString: string, table: string, prefix?: string): Promise<string>
export declare function inferSchema(connectionString: string, prefix?: string): Promise<string>
export declare function inferTableObject(connectionString: string, table: string): Promise<Table>
export declare function inferSchemaObject(
  connectionString: string
): Promise<
  {
    name: string
    table: Table
  }[]
>

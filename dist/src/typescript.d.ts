export interface Column {
  udtName: string
  nullable: boolean
  hasDefault: boolean
  defaultValue: string | null
  comment: string | null
  tsType?: string
}
export interface Table {
  [columnName: string]: Column
}
export declare function tableToTS(name: string, prefix: string, table: Table): string

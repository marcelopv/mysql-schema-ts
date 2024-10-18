'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const mysql_1 = require('mysql')
const url_1 = require('url')
const column_map_1 = require('./column-map')
const sql_template_strings_1 = require('sql-template-strings')
function parseEnum(dbEnum) {
  return dbEnum.replace(/(^(enum|set)\('|'\)$)/gi, '').split(`','`)
}
function enumNameFromColumn(dataType, columnName) {
  return `${dataType}_${columnName}`
}
function query(conn, sql) {
  return new Promise((resolve, reject) => {
    conn.query(sql.sql, sql.values, (error, results) => {
      if (error) {
        return reject(error)
      }
      return resolve(results)
    })
  })
}
exports.query = query
class MySQL {
  constructor(connectionString) {
    var _a
    this.connection = mysql_1.createConnection(connectionString)
    const database =
      ((_a = url_1.parse(connectionString, true).pathname) === null || _a === void 0 ? void 0 : _a.substr(1)) ||
      'public'
    this.defaultSchema = database
  }
  async table(tableName) {
    const enumTypes = await this.enums(tableName)
    const table = await this.getTable(tableName, this.schema())
    return column_map_1.mapColumn(table, enumTypes)
  }
  async allTables() {
    const names = await this.tableNames()
    const nameMapping = names.map(async name => ({
      name,
      table: await this.table(name)
    }))
    return Promise.all(nameMapping)
  }
  async tableNames() {
    const schemaTables = await query(
      this.connection,
      sql_template_strings_1.SQL`SELECT table_name as table_name
       FROM information_schema.columns
       WHERE table_schema = ${this.schema()}
       GROUP BY table_name
      `
    )
    return schemaTables.map(schemaItem => schemaItem.table_name)
  }
  schema() {
    return this.defaultSchema
  }
  async enums(tableName) {
    const enums = {}
    const rawEnumRecords = await query(
      this.connection,
      sql_template_strings_1.SQL`SELECT
         column_name as column_name,
         column_type as column_type,
         data_type as data_type 
      FROM information_schema.columns 
      WHERE data_type IN ('enum', 'set')
      AND table_schema = ${this.schema()}
      AND table_name = ${tableName}`
    )
    rawEnumRecords.forEach(enumItem => {
      const enumName = enumNameFromColumn(enumItem.data_type, enumItem.column_name)
      const enumValues = parseEnum(enumItem.column_type)
      enums[enumName] = enumValues
    })
    return enums
  }
  async getTable(tableName, tableSchema) {
    const Table = {}
    const tableColumns = await query(
      this.connection,
      sql_template_strings_1.SQL`SELECT 
           column_name as column_name,
           data_type as data_type,
           is_nullable as is_nullable,
           column_default as column_default,
           column_comment as column_comment
       FROM information_schema.columns
       WHERE table_name = ${tableName} 
       AND table_schema = ${tableSchema}`
    )
    tableColumns.forEach(schemaItem => {
      const columnName = schemaItem.column_name
      const dataType = schemaItem.data_type
      const isEnum = /^(enum|set)$/i.test(dataType)
      const nullable = schemaItem.is_nullable === 'YES'
      Table[columnName] = {
        udtName: isEnum ? enumNameFromColumn(dataType, columnName) : dataType,
        comment: schemaItem.column_comment,
        hasDefault: Boolean(schemaItem.column_default),
        defaultValue: schemaItem.column_default,
        nullable
      }
    })
    return Table
  }
}
exports.MySQL = MySQL
//# sourceMappingURL=mysql-client.js.map

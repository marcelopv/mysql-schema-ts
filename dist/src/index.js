'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const typescript_1 = require('./typescript')
const mysql_client_1 = require('./mysql-client')
const prettier_1 = __importDefault(require('prettier'))
const package_json_1 = __importDefault(require('../package.json'))
function pretty(code) {
  return prettier_1.default.format(code, {
    parser: 'typescript',
    ...package_json_1.default.prettier
  })
}
const JSONHeader = `
export type JSONPrimitive = string | number | boolean | null;
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONObject = { [member: string]: JSONValue };
export type JSONArray = Array<JSONValue>
`
const header = includesJSON => `
/**
 Schema Generated with ${package_json_1.default.name} ${package_json_1.default.version}
*/

${includesJSON ? JSONHeader : ''}
`
async function inferTable(connectionString, table, prefix) {
  const db = new mysql_client_1.MySQL(connectionString)
  const code = typescript_1.tableToTS(table, prefix || '', await db.table(table))
  const fullCode = `
    ${header(code.includes('JSON'))}
    ${code}
  `
  return pretty(fullCode)
}
exports.inferTable = inferTable
async function inferSchema(connectionString, prefix) {
  const db = new mysql_client_1.MySQL(connectionString)
  const tables = await db.allTables()
  const interfaces = tables.map(table => typescript_1.tableToTS(table.name, prefix || '', table.table))
  const code = [header(interfaces.some(i => i.includes('JSON'))), ...interfaces].join('\n')
  return pretty(code)
}
exports.inferSchema = inferSchema
async function inferTableObject(connectionString, table) {
  const db = new mysql_client_1.MySQL(connectionString)
  return db.table(table)
}
exports.inferTableObject = inferTableObject
async function inferSchemaObject(connectionString) {
  const db = new mysql_client_1.MySQL(connectionString)
  const tables = await db.allTables()
  return tables
}
exports.inferSchemaObject = inferSchemaObject
//# sourceMappingURL=index.js.map

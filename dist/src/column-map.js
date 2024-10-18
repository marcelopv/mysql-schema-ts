'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const lodash_1 = require('lodash')
const options = {
  BinaryAsBuffer: Boolean(process.env.BINARY_AS_BUFFER)
}
function mapColumn(Table, enumTypes) {
  return lodash_1.mapValues(Table, column => {
    var _a
    switch (column.udtName) {
      case 'char':
      case 'varchar':
      case 'text':
      case 'tinytext':
      case 'mediumtext':
      case 'longtext':
      case 'time':
      case 'geometry':
      case 'set':
      case 'enum':
        // keep set and enum defaulted to string if custom type not mapped
        column.tsType = 'string'
        return column
      case 'integer':
      case 'int':
      case 'smallint':
      case 'mediumint':
      case 'bigint':
      case 'double':
      case 'decimal':
      case 'numeric':
      case 'float':
      case 'year':
        column.tsType = 'number'
        return column
      case 'tinyint':
        column.tsType = 'boolean'
        return column
      case 'json':
        column.tsType = 'JSONValue'
        return column
      case 'date':
      case 'datetime':
      case 'timestamp':
        column.tsType = 'Date'
        return column
      case 'tinyblob':
      case 'mediumblob':
      case 'longblob':
      case 'blob':
      case 'binary':
      case 'varbinary':
      case 'bit':
        if (options.BinaryAsBuffer) {
          column.tsType = 'Buffer'
        } else {
          column.tsType = 'string'
        }
        return column
      default: {
        const name = column.udtName
        const enumType = enumTypes[name]
        column.tsType =
          ((_a = enumType) === null || _a === void 0 ? void 0 : _a.map(s => `'${s}'`).join(' | ')) || 'any'
        return column
      }
    }
  })
}
exports.mapColumn = mapColumn
//# sourceMappingURL=column-map.js.map

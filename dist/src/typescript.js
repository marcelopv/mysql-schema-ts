'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const camelcase_1 = __importDefault(require('camelcase'))
function camelize(s) {
  return camelcase_1.default(s, { pascalCase: true })
}
function normalize(name) {
  const reservedKeywords = ['string', 'number', 'package']
  let safename = name
  if (reservedKeywords.includes(name)) {
    safename = name + '_'
  }
  return safename
}
function tableToTS(name, prefix, table) {
  const members = withDefaults =>
    Object.keys(table).map(column => {
      const type = table[column].tsType
      const nullable = table[column].nullable ? '| null' : ''
      const hasDefault = table[column].hasDefault
      const defaultComment = hasDefault ? `Defaults to: ${table[column].defaultValue}.` : ''
      const comment = `${table[column].comment} ${defaultComment}`
      const tsComment = comment.trim().length > 0 ? `\n/** ${comment} */\n` : ''
      let isOptional = table[column].nullable
      if (withDefaults) {
        isOptional = isOptional || hasDefault
      }
      return `${tsComment}${normalize(column)}${isOptional ? '?' : ''}: ${type}${nullable}\n`
    })
  const tableName = (prefix || '') + camelize(normalize(name))
  return `
    /**
     * Exposes all fields present in ${name} as a typescript
     * interface.
    */
    export interface ${tableName} {
    ${members(false)}
    }

    /**
     * Exposes the same fields as ${tableName},
     * but makes every field containing a DEFAULT value optional.
     *
     * This is especially useful when generating inserts, as you
     * should be able to ommit these fields if you'd like
    */
    export interface ${tableName}WithDefaults {
    ${members(true)}
    }
  `.trim()
}
exports.tableToTS = tableToTS
//# sourceMappingURL=typescript.js.map

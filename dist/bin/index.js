#!/usr/bin/env node
'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const src_1 = require('../src')
const meow_1 = __importDefault(require('meow'))
const cli = meow_1.default(
  `
	Usage
	  $ mysql-schema-ts <input>

	Options
    --table, -t  Table name
    --prefix, -p Prefix to add to table names

	Examples
	  $ mysql-schema-ts --prefix SQL
`,
  {
    flags: {
      table: {
        type: 'string',
        alias: 't'
      },
      prefix: {
        type: 'string',
        alias: 'p',
        default: ''
      }
    }
  }
)
const db = cli.input[0]
const { table, prefix } = cli.flags
async function main() {
  if (table) {
    return src_1.inferTable(db, table, prefix)
  }
  return src_1.inferSchema(db, prefix)
}
main()
  .then(code => {
    process.stdout.write(code)
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
//# sourceMappingURL=index.js.map

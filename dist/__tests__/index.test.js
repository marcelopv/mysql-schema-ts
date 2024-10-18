'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const mysql_1 = require('mysql')
const mysql_client_1 = require('../src/mysql-client')
const src_1 = require('../src')
const sql_template_strings_1 = require('sql-template-strings')
const connectionString = 'mysql://root@localhost:3306/test'
const conn = mysql_1.createConnection(connectionString)
const agreements = sql_template_strings_1.SQL`
  CREATE TABLE IF NOT EXISTS agreements (                 
    id varbinary(24) NOT NULL,              
    billing_plan_id varbinary(24) NOT NULL, 
    category varbinary(24) NOT NULL,        
    name varbinary(64) NOT NULL,            
    PRIMARY KEY (id)                        
)`
const withJSON = sql_template_strings_1.SQL`
  CREATE TABLE IF NOT EXISTS table_with_json (                 
    id varbinary(24) NOT NULL,              
    data json DEFAULT NULL,
    PRIMARY KEY (id)                        
)`
const requests = sql_template_strings_1.SQL`
  CREATE TABLE IF NOT EXISTS requests (
    id int(11) NOT NULL,
    name varchar(255) NOT NULL,
    url varchar(255) NOT NULL,
    integration_type enum('source','destination') NOT NULL
  )
`
const complex = sql_template_strings_1.SQL`
  CREATE TABLE IF NOT EXISTS complex (
    id varbinary(255) NOT NULL,
    name varchar(255) NOT NULL,
    nullable varchar(255),
    created_at timestamp,
    created_on date NOT NULL,
    documented_field varchar(255) COMMENT "This is an awesome field"
  )
`
beforeAll(async () => {
  await mysql_client_1.query(conn, agreements)
  await mysql_client_1.query(conn, requests)
  await mysql_client_1.query(conn, complex)
  await mysql_client_1.query(conn, withJSON)
})
describe('inferTable', () => {
  it('infers a table', async () => {
    const code = await src_1.inferTable(connectionString, 'agreements')
    expect(code).toMatchInlineSnapshot(`
      "/**
       Schema Generated with mysql-schema-ts 1.6.1
      */

      /**
       * Exposes all fields present in agreements as a typescript
       * interface.
       */
      export interface Agreements {
        id: string
        billing_plan_id: string
        category: string
        name: string
      }

      /**
       * Exposes the same fields as Agreements,
       * but makes every field containing a DEFAULT value optional.
       *
       * This is especially useful when generating inserts, as you
       * should be able to ommit these fields if you'd like
       */
      export interface AgreementsWithDefaults {
        id: string
        billing_plan_id: string
        category: string
        name: string
      }
      "
    `)
  })
  it('works with enums', async () => {
    const code = await src_1.inferTable(connectionString, 'requests')
    expect(code).toMatchInlineSnapshot(`
      "/**
       Schema Generated with mysql-schema-ts 1.6.1
      */

      /**
       * Exposes all fields present in requests as a typescript
       * interface.
       */
      export interface Requests {
        id: number
        name: string
        url: string
        integration_type: 'source' | 'destination'
      }

      /**
       * Exposes the same fields as Requests,
       * but makes every field containing a DEFAULT value optional.
       *
       * This is especially useful when generating inserts, as you
       * should be able to ommit these fields if you'd like
       */
      export interface RequestsWithDefaults {
        id: number
        name: string
        url: string
        integration_type: 'source' | 'destination'
      }
      "
    `)
  })
  it('works with complex types', async () => {
    const code = await src_1.inferTable(connectionString, 'complex')
    expect(code).toMatchInlineSnapshot(`
      "/**
       Schema Generated with mysql-schema-ts 1.6.1
      */

      /**
       * Exposes all fields present in complex as a typescript
       * interface.
       */
      export interface Complex {
        id: string
        name: string
        nullable?: string | null
        /**  Defaults to: CURRENT_TIMESTAMP. */
        created_at: Date
        created_on: Date
        /** This is an awesome field  */
        documented_field?: string | null
      }

      /**
       * Exposes the same fields as Complex,
       * but makes every field containing a DEFAULT value optional.
       *
       * This is especially useful when generating inserts, as you
       * should be able to ommit these fields if you'd like
       */
      export interface ComplexWithDefaults {
        id: string
        name: string
        nullable?: string | null
        /**  Defaults to: CURRENT_TIMESTAMP. */
        created_at?: Date
        created_on: Date
        /** This is an awesome field  */
        documented_field?: string | null
      }
      "
    `)
  })
  it('works with JSON', async () => {
    const code = await src_1.inferTable(connectionString, 'table_with_json')
    expect(code).toMatchInlineSnapshot(`
      "/**
       Schema Generated with mysql-schema-ts 1.6.1
      */

      export type JSONPrimitive = string | number | boolean | null
      export type JSONValue = JSONPrimitive | JSONObject | JSONArray
      export type JSONObject = { [member: string]: JSONValue }
      export type JSONArray = Array<JSONValue>

      /**
       * Exposes all fields present in table_with_json as a typescript
       * interface.
       */
      export interface TableWithJson {
        id: string
        data?: JSONValue | null
      }

      /**
       * Exposes the same fields as TableWithJson,
       * but makes every field containing a DEFAULT value optional.
       *
       * This is especially useful when generating inserts, as you
       * should be able to ommit these fields if you'd like
       */
      export interface TableWithJsonWithDefaults {
        id: string
        data?: JSONValue | null
      }
      "
    `)
  })
})
describe('inferSchema', () => {
  it('infers all tables at once', async () => {
    const code = await src_1.inferSchema(connectionString)
    expect(code).toMatchInlineSnapshot(`
      "/**
       Schema Generated with mysql-schema-ts 1.6.1
      */

      export type JSONPrimitive = string | number | boolean | null
      export type JSONValue = JSONPrimitive | JSONObject | JSONArray
      export type JSONObject = { [member: string]: JSONValue }
      export type JSONArray = Array<JSONValue>

      /**
       * Exposes all fields present in agreements as a typescript
       * interface.
       */
      export interface Agreements {
        id: string
        billing_plan_id: string
        category: string
        name: string
      }

      /**
       * Exposes the same fields as Agreements,
       * but makes every field containing a DEFAULT value optional.
       *
       * This is especially useful when generating inserts, as you
       * should be able to ommit these fields if you'd like
       */
      export interface AgreementsWithDefaults {
        id: string
        billing_plan_id: string
        category: string
        name: string
      }
      /**
       * Exposes all fields present in complex as a typescript
       * interface.
       */
      export interface Complex {
        id: string
        name: string
        nullable?: string | null
        /**  Defaults to: CURRENT_TIMESTAMP. */
        created_at: Date
        created_on: Date
        /** This is an awesome field  */
        documented_field?: string | null
      }

      /**
       * Exposes the same fields as Complex,
       * but makes every field containing a DEFAULT value optional.
       *
       * This is especially useful when generating inserts, as you
       * should be able to ommit these fields if you'd like
       */
      export interface ComplexWithDefaults {
        id: string
        name: string
        nullable?: string | null
        /**  Defaults to: CURRENT_TIMESTAMP. */
        created_at?: Date
        created_on: Date
        /** This is an awesome field  */
        documented_field?: string | null
      }
      /**
       * Exposes all fields present in requests as a typescript
       * interface.
       */
      export interface Requests {
        id: number
        name: string
        url: string
        integration_type: 'source' | 'destination'
      }

      /**
       * Exposes the same fields as Requests,
       * but makes every field containing a DEFAULT value optional.
       *
       * This is especially useful when generating inserts, as you
       * should be able to ommit these fields if you'd like
       */
      export interface RequestsWithDefaults {
        id: number
        name: string
        url: string
        integration_type: 'source' | 'destination'
      }
      /**
       * Exposes all fields present in table_with_json as a typescript
       * interface.
       */
      export interface TableWithJson {
        id: string
        data?: JSONValue | null
      }

      /**
       * Exposes the same fields as TableWithJson,
       * but makes every field containing a DEFAULT value optional.
       *
       * This is especially useful when generating inserts, as you
       * should be able to ommit these fields if you'd like
       */
      export interface TableWithJsonWithDefaults {
        id: string
        data?: JSONValue | null
      }
      "
    `)
  })
})
//# sourceMappingURL=index.test.js.map

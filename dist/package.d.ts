declare const _exports: {
  name: string
  version: string
  description: string
  main: string
  types: string
  author: string
  license: string
  scripts: {
    lint: string
    test: string
    pub: string
    mycli: string
    cli: string
  }
  prettier: {
    semi: boolean
    singleQuote: boolean
    printWidth: number
  }
  repository: {
    type: string
    url: string
  }
  dependencies: {
    camelcase: string
    lodash: string
    meow: string
    mysql: string
    prettier: string
    'sql-template-strings': string
  }
  files: string[]
  bin: {
    'mysql-schema-ts': string
  }
  'lint-staged': {
    '*.{js,jsx,ts,tsx}': string[]
    '*.{yml,md,json}': string[]
  }
  husky: {
    hooks: {
      'pre-commit': string
    }
  }
  keywords: string[]
  devDependencies: {
    '@types/jest': string
    '@types/lodash': string
    '@types/meow': string
    '@types/mysql': string
    '@types/node': string
    '@types/prettier': string
    '@typescript-eslint/eslint-plugin': string
    '@typescript-eslint/parser': string
    eslint: string
    'eslint-config-prettier': string
    husky: string
    jest: string
    'lint-staged': string
    np: string
    'ts-jest': string
    'ts-node': string
    typescript: string
  }
}
export = _exports

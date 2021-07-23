# Contribution guidelines
The guidelines for contribution to babitz backend project are listed below. Please go through it before any contribution.

## 1. General guidelines
- The general guidelines for writing code. We will be using a subset of [typescript contribution guidelines](https://github.com/microsoft/TypeScript/wiki/Coding-guidelines). In case any of these conflict with loopback4 guidelines, loopback4's guideline is taken as priority. 

  ### Names
    1. Use PascalCase for type names.
    2. Use PascalCase for enum values.
    3. Use camelCase for function names.
    4. Use camelCase for property names and local variables.
    5. Do not use `_` as a prefix for private properties.
    6. Use whole words in names when possible.

  ### Types
    1. Do not export types/functions unless you need to share it across multiple components.
    2. Do not introduce new types/values to the global namespace.
    3. Shared types should be defined in `types.ts`.
    4. Within a file, type definitions should come first.

  ### `null` and `undefined`
    1. Use `undefined`. Do not use null.

  ### General Assumptions
    1. Consider objects like Nodes, Symbols, etc. as immutable outside the component that created them. Do not change them.
    2. Consider arrays as immutable by default after creation.

  ### Flags
    1. More than 2 related Boolean properties on a type should be turned into a flag.

  ### Comments
    1. Use JSDoc style comments for functions, interfaces, enums, and classes.

  ### General Constructs
    1. Do not use `for..in` statements; instead, use `ts.forEach`, `ts.forEachKey` and `ts.forEachValue`. Be aware of their slightly different semantics.
    2. Try to use `ts.forEach`, `ts.map`, and `ts.filter` instead of loops when it is not strongly inconvenient.

  ### Style
    1. Use arrow functions over anonymous function expressions.
    2. Only surround arrow function parameters when necessary. <br />For example, `(x) => x + x` is wrong but the following are correct:
        - `x => x + x`
        - `(x,y) => x + y`
        - `<T>(x: T, y: T) => x === y`
    3. Always surround loop and conditional bodies with curly braces. Statements on the same line are allowed to omit braces.
    4. Open curly braces always go on the same line as whatever necessitates them.
    5. Parenthesized constructs should have no surrounding whitespace. <br />A single space follows commas, colons, and semicolons in those constructs. For example:
        - `for (var i = 0, n = str.length; i < 10; i++) { }`
        - `if (x < 10) { }`
        - `function f(x: number, y: string): void { }`
    6. Use a single declaration per variable statement <br />(i.e. use `var x = 1; var y = 2;` over `var x = 1, y = 2;`).
    7. `else` goes on a separate line from the closing curly brace.
    8. Use 1 tab per indentation.

## Loopback4 Guidelines
- File Naming Convention taken from [angular's file naming convention](https://angular.io/guide/styleguide#separate-file-names-with-dots-and-dashes). Loopback internally uses this so this decision is taken to have consistency in file names. This states we use a file name to also represent what it does or is.
    - an example is "user.model.ts" here we can see the file is a "model" and the name of the model is "user". 
- We clearly define our api spec before coding the models and endpoints for them. Please have a look at how to [import api spec in loopback 4.](https://loopback.io/doc/en/lb4/OpenAPI-generator.html)


## Directory structure
Following the loopback4 directory structure we have the following directories and their purpose.
- Under .src we have 5 directories.
    - __controllers__ : These contain the api endpoints and their request/response structures.
    - __datasources__ : Contains the datasources used in the codebase.
    - __models__ : Contains all the data models used across the whole codebase.
    - __repositories__: Contains the implementations of each model. The database crud and other methods. 
    - __ __tests__ __: Contains the tests for each model (unit , acceptence, integration)
        - unit 
        - acceptence
        - integration

We will follow the same structure for our codebase. 
```
├── src
│   ├── controllers
│   │   ├── index.ts
│   │   └── restaurant.controller.ts
│   ├── datasources
│   │   ├── index.ts
│   │   └── pg.datasource.ts
│   ├── models
│   │   ├── index.ts
│   │   ├── location.model.ts
│   │   └── restaurant.model.ts
│   ├── repositories
│   │   ├── README.md
│   │   ├── index.ts
│   │   └── restaurant.repository.ts
│   └── sequence.ts
│   ├── __tests__
│   │   ├── README.md
│   │   └── acceptance
|   |       ├── restaurant.controller.acceptance.ts
│   │       └── test-helper.ts
│   │   └── unit
|   |       ├── restaurant.controller.unit.ts
│   │       └── test-helper.ts
│   │   └── integration
|   |       ├── restaurant.integration.unit.ts
│   │       └── test-helper.ts
├── public
│   └── index.html
├── Dockerfile
├── README.md
├── coverage
├── dist
├── package.json
├── tsconfig.json
├── tsconfig.tsbuildinfo
├── yarn-error.log
├── Contribution-guidelines.md
└── yarn.lock
```          	



## Linting and Formatting
 Apart from the typescript [Style](https://github.com/microsoft/TypeScript/wiki/Coding-guidelines#style) we use prettier and ESLint. 
- Use ESLint to statically analyse the source code and detect common problems. Config used from loopback/eslint-config.
- Prettier to keep our code always formatted the same way. Config stored in .prettierrc
- Both of these can be done with `  npm run lint:fix  `


## Testing

- Write tests in the __test__ folder.
- Make sure you cover at least 50% of the test-case scenario.
- You can generate "test coverage" using the `npm run test:coverage` command.


## Commit messages

Commit messages should adhere to the following guidelines:

- Should be in active case
- Should be divided into a subject line and a body
- The subject summarizes the code changes in commit
- Use the body to explain what and why vs. How
- Separate subject from body with a blank line
- Use the imperative mood in the subject line
- Do not end the subject line with a period
- Limit the subject line to 50 characters
- Capitalize the subject line
- Wrap the body at 72 characters

Reference: [how to write good commits](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13
 https://chris.beams.io/posts/git-commit)

## How to Raise Pull Requests 
- Avoid making large pull requests so that code review gets easier.
- Use either one feature/fix or one commit per pull request only.


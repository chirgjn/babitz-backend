# Babitz
This is a [Loopback4](https://loopback.io/doc/en/lb4/index.html) project. If you want to know more about Babitz, you can read the checkout the main project [repo](https://github.com/pesto-students/babitz).
This is the api server for Babitz.

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
yarn install
```
## Install [Postgres Database](https://www.postgresql.org)
We use postgres for our database requirements. 

## [Migrate](https://loopback.io/doc/en/lb4/Database-migrations.html) database schema

```sh
yarn run migrate
```

## Run the application

```sh
yarn start
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:3000 in your browser.

## Rebuild the project

To incrementally build the project:

```sh
yarn run build
```

To force a full build by cleaning up cached artifacts:

```sh
yarn run rebuild
```

## Fix code style and formatting issues

```sh
yarn run lint
```

To automatically fix such issues:

```sh
yarn run lint:fix
```

## Other useful commands

- `yarn run migrate`: Migrate database schemas for models
- `yarn run openapi-spec`: Generate OpenAPI spec into a file
- `yarn run docker:build`: Build a Docker image for this application
- `yarn run docker:run`: Run this application inside a Docker container

## Tests

```sh
yarn test
```

## Want to contribute?
If you wish to contribute, please go through the [contribution guidelines](https://github.com/pesto-students/babitz-backend/blob/Contribution.md/Contributing.md). 

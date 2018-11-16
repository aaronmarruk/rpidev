# Raspberry Pi Developer Task

REST API for the Raspberry Pi developer task.

## Running the application

Before you start the application you will need the latest Node version, which is v11.0.0.

If you have `nvm` installed:

```
# To install the latest Node version
nvm install node

nvm use node
```

You then have a couple options:

1. `npm run develop` – this will run a development server with a file based database backend (`sqlite`).
2. `npm run test` – this will run the test suite, which cover each of the API endpoints.

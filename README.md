# Raspberry Pi Developer Task

This is the codebase for my REST API for the Raspberry Pi Developer Task. I built the API on Node.js using Express. I decided on Express as it still ranks higher in certain aspects which I look for when choosing frameworks, such as Github ranking and overall health of the project (i.e. size of community, and recent updates).

## Running the application

Before you start the application you will need the latest (as of time of writing) Node version, which is v11.0.0.

If you have `nvm` installed:

```
# To install the latest Node version
nvm install node

nvm use node
```

You then have a couple options:

1. `npm run develop` – this will run a development server with a file based database backend (`sqlite`).
2. `npm run test` – this will run the test suite, which cover each of the API endpoints.

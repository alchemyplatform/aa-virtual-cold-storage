# cold-storage-plugin

## [Xata](https://xata.io) features:

- Offset based pagination
- Form management and submission
- Search
- Aggregations
- Summaries
- Image transformations
- Queries using junction tables and links

## Development

You'll need to [install Xata](https://xata.io/docs/getting-started/installation) before performing these steps.

- `git clone git@github.com:OMGWINNING/cold-storage-plugin.git`
- `cd cold-storage-plugin`
- `yarn install`
- Run `yarn run bootstrap` the first time you set up the project with your database, and then seed in some data.
- `yarn run dev` to load the site at http://localhost:3000

## Environment variables

After you run init, your `.env` file should look like this

```bash
NODE_ENV=<YOUR_NODE_ENV>

ALCHEMY_KEY=<YOUR_ALCHEMY_KEY>
NEXT_PUBLIC_ALCHEMY_GAS_MANAGER_POLICY_ID=<YOUR_ALCHEMY_GAS_MANAGER_POLICY_ID>

# Xata credentials
XATA_BRANCH=main
XATA_API_KEY=

# Setting to true will disable API / UI to write to the database
READ_ONLY=false

NEXT_TELEMETRY_DISABLED=1
```

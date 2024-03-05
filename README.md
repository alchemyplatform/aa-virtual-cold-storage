# cold-storage-plugin

## Development

- `git clone git@github.com:OMGWINNING/cold-storage-plugin.git`
- `cd cold-storage-plugin`
- `yarn install`
- `yarn run dev` to load the site at http://localhost:3000

## Environment variables

After you run init, your `.env` file should look like this

```bash
NODE_ENV=development

ALCHEMY_RPC_URL=<YOUR_ALCHEMY_RPC_URL>
ALCHEMY_API_URL=<YOUR_ALCHEMY_API_URL>

# https://dashboard.alchemy.com/apps
ALCHEMY_API_KEY=<YOUR_ALCHEMY_API_KEY>

# you can also use Access Keys of your account
# https://dashboard.alchemy.com/settings/access-keys
ALCHEMY_ACCESS_KEY=<YOUR_ALCHEMY_ACCESS_KEY>

# https://dashboard.alchemy.com/gas-manager
NEXT_PUBLIC_ALCHEMY_GAS_MANAGER_POLICY_ID=<YOUR_ALCHEMY_GAS_MANAGER_POLICY_ID>

NEXT_TELEMETRY_DISABLED=1
```

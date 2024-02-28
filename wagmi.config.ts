import { defineConfig } from '@wagmi/cli';
import { actions, foundry, react } from '@wagmi/cli/plugins';

export default defineConfig({
  out: 'utils/wagmi.ts',
  contracts: [],
  plugins: [
    actions(),
    foundry({
      project: 'contracts/',
      // Pick and choose which contracts to generate for. Otherwise the output
      // is gigantic and full of stuff we'll never use.
      include: ['FreelyMintableNft.sol/**']
    }),
    react()
  ]
});

import { SmartAccountClient } from '@alchemy/aa-core';
import { Hex } from 'viem';

export async function waitForUserOp(client: SmartAccountClient, hash: Hex): Promise<void> {
  await client.waitForUserOperationTransaction({ hash });
  const receipt = await client.getUserOperationReceipt(hash);
  if (!receipt) {
    throw new Error('User operation not mined');
  }
  if (!receipt.success) {
    throw new Error('User operation failed execution');
  }
}

#!/usr/bin/env bash

# Not -x. That would print the sensitive env vars to console.
set -e

# https://stackoverflow.com/a/246128/2695248
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
CONTRACTS_DIR=${SCRIPT_DIR}/..

cd $CONTRACTS_DIR

source .env
forge script script/DeployForReal.s.sol:DeployForReal \
  --broadcast \
  --rpc-url $ARBITRUM_SEPOLIA_RPC_URL \
  -vvvv
# Verification currently broken on Sepolia Arbiscan
#  --verify \
cp out/deployed.ts ../utils/

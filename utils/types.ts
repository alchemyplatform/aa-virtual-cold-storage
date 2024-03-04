import { GetAccountParameter, SmartContractAccount, UserOperationOverrides } from '@alchemy/aa-core';
import { Hash, Hex, type Abi, type Address, type Client, type GetContractReturnType, type PublicClient } from 'viem';

export type Plugin<TAbi extends Abi = Abi> = {
  meta: {
    name: string;
    version: string;
    addresses: Record<number, Address>;
  };
  getContract: <C extends Client>(client: C, address?: Address) => GetContractReturnType<TAbi, PublicClient, Address>;
};

export type FunctionId = Hex;

// Treats the first 20 bytes as an address, and the last byte as a identifier.
export type FunctionReference = Hex;

export type ExecutionFunctionConfig = {
  plugin: Address;
  userOpValidationFunction: FunctionReference;
  runtimeValidationFunction: FunctionReference;
};

export type ExecutionHooks = {
  preExecHook: FunctionReference;
  postExecHook: FunctionReference;
};

export type PreValidationHooks = [readonly FunctionReference[], readonly FunctionReference[]];

export type InstallPluginParams<TAccount extends SmartContractAccount | undefined = SmartContractAccount | undefined> =
  {
    pluginAddress: Address;
    manifestHash?: Hash;
    pluginInitData?: Hash;
    dependencies?: FunctionReference[];
  } & { overrides?: UserOperationOverrides } & GetAccountParameter<TAccount>;

export type UninstallPluginParams<
  TAccount extends SmartContractAccount | undefined = SmartContractAccount | undefined
> = {
  pluginAddress: Address;
  config?: Hash;
  pluginUninstallData?: Hash;
} & { overrides?: UserOperationOverrides } & GetAccountParameter<TAccount>;

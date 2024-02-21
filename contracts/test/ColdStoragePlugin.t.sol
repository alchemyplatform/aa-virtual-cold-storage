// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {ColdStoragePlugin} from "../src/ColdStoragePlugin.sol";
import {UpgradeableModularAccount} from "modular-account/account/UpgradeableModularAccount.sol";
import {MultiOwnerPlugin} from "modular-account/plugins/owner/MultiOwnerPlugin.sol";
import {MultiOwnerModularAccountFactory} from "modular-account/factory/MultiOwnerModularAccountFactory.sol";
import {FunctionReference} from "modular-account/interfaces/IPluginManager.sol";
import {IEntryPoint} from "modular-account/interfaces/erc4337/IEntryPoint.sol";
import {EntryPoint} from "@eth-infinitism/account-abstraction/core/EntryPoint.sol";

contract ColdStoragePluginTest is Test {
    ColdStoragePlugin public coldStoragePlugin;
    IEntryPoint public entryPoint;
    address[] public owners;
    address owner;
    uint256 ownerKey;
    MultiOwnerPlugin multiOwnerPlugin;
    MultiOwnerModularAccountFactory factory;
    UpgradeableModularAccount account;

    function test_coldStoragePlugin_installSuccess() public {
        entryPoint = IEntryPoint(address(new EntryPoint()));
        (owner, ownerKey) = makeAddrAndKey("owner");
        vm.deal(address(account), 100 ether);

        // setup plugins and factory
        multiOwnerPlugin = new MultiOwnerPlugin();
        address impl = address(new UpgradeableModularAccount(entryPoint));

        factory = new MultiOwnerModularAccountFactory(
            address(this),
            address(multiOwnerPlugin),
            impl,
            keccak256(abi.encode(multiOwnerPlugin.pluginManifest())),
            entryPoint
        );

        // create single owner MSCA
        owners = new address[](1);
        owners[0] = owner;
        account = UpgradeableModularAccount(payable(factory.createAccount(0, owners)));

        coldStoragePlugin = new ColdStoragePlugin();
        bytes32 manifestHash = keccak256(abi.encode(coldStoragePlugin.pluginManifest()));
        FunctionReference[] memory dependencies = new FunctionReference[](0);


        vm.prank(owner);
        account.installPlugin({
            plugin: address(coldStoragePlugin),
            manifestHash: manifestHash,
            pluginInstallData: abi.encode(),
            dependencies: dependencies
        });
    }
}

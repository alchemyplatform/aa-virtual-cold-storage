// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import {Test} from "forge-std/Test.sol";
import {ColdStoragePlugin} from "../src/ColdStoragePlugin.sol";
import {UpgradeableModularAccount} from "modular-account/account/UpgradeableModularAccount.sol";
import {MultiOwnerPlugin} from "modular-account/plugins/owner/MultiOwnerPlugin.sol";
import {MultiOwnerModularAccountFactory} from "modular-account/factory/MultiOwnerModularAccountFactory.sol";
import {FunctionReference} from "modular-account/interfaces/IPluginManager.sol";
import {IEntryPoint} from "modular-account/interfaces/erc4337/IEntryPoint.sol";
import {EntryPoint} from "@eth-infinitism/account-abstraction/core/EntryPoint.sol";
import {NFT} from "foundry-soulmate-erc721-example/src/NFT.sol"; 

contract ColdStoragePluginTest is Test {
    NFT public nft;
    ColdStoragePlugin public coldStoragePlugin;
    IEntryPoint public entryPoint;
    address[] public owners;
    address _owner;
    uint256 _ownerKey;
    MultiOwnerPlugin _multiOwnerPlugin;
    MultiOwnerModularAccountFactory _factory;
    UpgradeableModularAccount _account;

    function setUp() public {
        entryPoint = IEntryPoint(address(new EntryPoint()));
        (_owner, _ownerKey) = makeAddrAndKey("owner");
        vm.deal(address(_account), 100 ether);

        // setup plugins and factory
        _multiOwnerPlugin = new MultiOwnerPlugin();
        address impl = address(new UpgradeableModularAccount(entryPoint));

        _factory = new MultiOwnerModularAccountFactory(
            address(this),
            address(_multiOwnerPlugin),
            impl,
            keccak256(abi.encode(_multiOwnerPlugin.pluginManifest())),
            entryPoint
        );

        // create single owner MSCA
        owners = new address[](1);
        owners[0] = _owner;
        _account = UpgradeableModularAccount(payable(_factory.createAccount(0, owners)));

        coldStoragePlugin = new ColdStoragePlugin();
        bytes32 manifestHash = keccak256(abi.encode(coldStoragePlugin.pluginManifest()));
        FunctionReference[] memory dependencies = new FunctionReference[](0);

        vm.prank(_owner);
        _account.installPlugin({
            plugin: address(coldStoragePlugin),
            manifestHash: manifestHash,
            pluginInstallData: abi.encode(),
            dependencies: dependencies
        });
        
        // Create a NFT contract to test
        nft = new NFT("Test NFT", "TEST", "baseUri");
    }

    function testPreExecutionHook() public {
        nft.mintTo{value: 0.0 ether}(address(_account));
        vm.prank(_owner);

        ColdStoragePlugin(address(_account)).lockERC721All(100);

        // Try to transfer the NFT
        vm.expectRevert("StdChains getChain(string): Chain with alias \"does_not_exist\" not found.");
        nft.safeTransferFrom(address(_account), address(this), 0);
        
    }
}

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
import {FreelyMintableNft} from "../src/nft/FreelyMintableNft.sol";
import {FunctionReferenceLib} from "modular-account/helpers/FunctionReferenceLib.sol";
import {IMultiOwnerPlugin} from "modular-account/plugins/owner/IMultiOwnerPlugin.sol";
import {Call} from "modular-account/interfaces/IStandardExecutor.sol";

contract ColdStoragePluginTest is Test {
    FreelyMintableNft public nft;
    ColdStoragePlugin public coldStoragePlugin;
    IEntryPoint public entryPoint;
    address[] public owners;
    address _owner;
    uint256 _ownerKey;
    address _storageKey;
    uint256 _storagePrivateKey;
    MultiOwnerPlugin _multiOwnerPlugin;
    MultiOwnerModularAccountFactory _factory;
    UpgradeableModularAccount _account;

    function setUp() public {
        entryPoint = IEntryPoint(address(new EntryPoint()));
        (_owner, _ownerKey) = makeAddrAndKey("owner");
        (_storageKey, _storagePrivateKey) = makeAddrAndKey("storageKey");
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
        FunctionReference[] memory dependencies = new FunctionReference[](2);
        dependencies[0] = FunctionReferenceLib.pack(
            address(_multiOwnerPlugin), uint8(IMultiOwnerPlugin.FunctionId.RUNTIME_VALIDATION_OWNER_OR_SELF)
        );
        dependencies[1] = FunctionReferenceLib.pack(
            address(_multiOwnerPlugin), uint8(IMultiOwnerPlugin.FunctionId.USER_OP_VALIDATION_OWNER)
        );

        vm.prank(_owner);
        _account.installPlugin({
            plugin: address(coldStoragePlugin),
            manifestHash: manifestHash,
            pluginInstallData: abi.encode(address(_storageKey)),
            dependencies: dependencies
        });

        // Create a NFT contract to test
        nft = new FreelyMintableNft("Free NFT", "FREE", "#000000");
    }

    function testLockAll() public {
        nft.mint(address(_account), 1);
        vm.prank(_owner);
        ColdStoragePlugin(address(_account)).lockERC721All(100);

        // console2.log("%s, %s", _account, _owner);
        // _account.execute(address(coldStoragePlugin), 0,
        // abi.encodeWithSelector(ColdStoragePlugin.lockERC721All.selector, 100));
        // Try to transfer the NFT

        // error RuntimeValidationFunctionReverted(address plugin, uint8 functionId, bytes revertReason);

        // // vm.expectRevert("Existing lock in place");

        // vm.expectRevert(abi.encodeWithSelector(UpgradeableModularAccount.RuntimeValidationFunctionReverted.selector,
        // address(_multiOwnerPlugin), uint8(0), "Existing lock in place"));
        vm.expectRevert(
            abi.encodeWithSelector(
                UpgradeableModularAccount.PreExecHookReverted.selector,
                address(coldStoragePlugin),
                2,
                abi.encodeWithSelector(0x08c379a0, "ERC721 locked")
            )
        );
        vm.prank(_owner);
        _account.execute(
            address(nft), 0, abi.encodeWithSelector(0x42842e0e, address(_account), address(uint160(1)), 0)
        );
    }

    function testExecuteFromStorageKey() public {
        nft.mint(address(_account), 1);
        vm.prank(_owner);
        ColdStoragePlugin(address(_account)).lockERC721All(100);

        Call[] memory calls = new Call[](1);
        calls[0] = Call({
            target: address(nft),
            value: 0,
            data: abi.encodeWithSelector(0x42842e0e, address(_account), address(uint160(1)), 0)
        });        
        vm.prank(_storageKey);
        ColdStoragePlugin(address(_account)).executeWithStorageKey(calls);
        assertEq(nft.ownerOf(0), address(uint160(1)));
    }
}

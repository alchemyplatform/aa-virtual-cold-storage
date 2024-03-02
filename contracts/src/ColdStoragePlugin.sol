// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import {BasePlugin} from "modular-account/plugins/BasePlugin.sol";
import {PluginManifest, PluginMetadata} from "modular-account/interfaces/IPlugin.sol";
import {IColdStoragePlugin} from "./IColdStoragePlugin.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Call, IStandardExecutor} from "modular-account/interfaces/IStandardExecutor.sol";
import {IPluginExecutor} from "modular-account/interfaces/IPluginExecutor.sol";
import {
    IPlugin,
    ManifestFunction,
    ManifestAssociatedFunctionType,
    ManifestAssociatedFunction,
    ManifestExecutionHook
} from "modular-account/interfaces/IPlugin.sol";
import {ERC721LockMapLib} from "./ERC721LockMapLib.sol";

contract ColdStoragePlugin is IColdStoragePlugin, BasePlugin {
    using ERC721LockMapLib for ERC721LockMapLib.ERC721LockMap;

    string internal constant _NAME = "Cold Storage Plugin";
    string internal constant _VERSION = "0.1.0";
    string internal constant _AUTHOR = "Alchemy";

    mapping(address => address) public storageKeys;
    mapping(address => uint256) public erc721AllLocks;
    mapping(address => ERC721LockMapLib.ERC721LockMap) erc721Locks;

    // Constants used in the manifest
    uint256 internal constant _MANIFEST_DEPENDENCY_INDEX_OWNER_RUNTIME_VALIDATION = 0;
    uint256 internal constant _MANIFEST_DEPENDENCY_INDEX_OWNER_USER_OP_VALIDATION = 1;

    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // ┃    Execution functions    ┃
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

    bytes4 constant SAFE_TRANSFER_FROM = 0x42842e0e;
    bytes4 constant SAFE_TRANSFER_FROM_WITH_DATA = 0xb88d4fde;

    /// @inheritdoc IColdStoragePlugin
    function executeWithStorageKey(Call[] calldata calls)
        external
        returns (bytes[] memory)
    {
        uint256 callsLength = calls.length;
        bytes[] memory results = new bytes[](callsLength);

        for (uint256 i = 0; i < callsLength; ++i) {
            Call calldata call = calls[i];
            // Only allow the cold storage key to execute transfers and approvals of NFTs, the methods that are
            // currently locked.
            // TODO: Check to make sure that you are only dealing wth locked tokens and are only for transfers from
            // self.
            require(
                call.data.length >= 4 && isErc721LockedFunction(bytes4(call.data)),
                "Call must be approve, safeTransferFrom, or transferFrom"
            );
            results[i] = IPluginExecutor(msg.sender).executeFromPluginExternal(call.target, call.value, call.data);
        }

        return results;
    }

    /// @inheritdoc IColdStoragePlugin
    function changeStorageKey(address storageKey) external {
        storageKeys[msg.sender] = storageKey;
    }

    /// @inheritdoc IColdStoragePlugin
    function lockERC721All(uint48 duration) external {
        require(duration > 0, "Duration must be greater than 0");
        address sender = msg.sender;
        require(erc721AllLocks[sender] == 0, "Existing lock in place");
        erc721AllLocks[sender] = block.timestamp + duration;
        emit ERC721Locked(sender, duration);
    }

    /// @inheritdoc IColdStoragePlugin
    function lockERC721Collection(ERC721CollectionLock[] calldata locks) external {
        for (uint256 i = 0; i < locks.length; ++i) {
            ERC721CollectionLock calldata lock = locks[i];
            require(
                erc721AllLocks[msg.sender] <= block.timestamp
                    && erc721Locks[msg.sender].get(true, lock.contractAddress, 0).lockEndTime <= block.timestamp,
                "Existing lock in place"
            );
            erc721Locks[msg.sender].set(true, lock.contractAddress, 0, block.timestamp + lock.duration);
            emit ERC721Locked(msg.sender, lock.duration);
        }
    }

    /// @inheritdoc IColdStoragePlugin
    function lockERC721Token(ERC721TokenLock[] calldata locks) external {
        for (uint256 i = 0; i < locks.length; ++i) {
            ERC721TokenLock calldata lock = locks[i];
            require(
                erc721AllLocks[msg.sender] <= block.timestamp
                    && erc721Locks[msg.sender].get(true, lock.token.contractAddress, 0).lockEndTime <= block.timestamp
                    && erc721Locks[msg.sender].get(false, lock.token.contractAddress, lock.token.tokenId).lockEndTime <= block.timestamp,
                "Existing lock in place"
            );

            erc721Locks[msg.sender].set(false, lock.token.contractAddress, lock.token.tokenId, block.timestamp + lock.duration);
        }
    }

    /// @inheritdoc IColdStoragePlugin
    function unlockERC721All() external {
        delete erc721AllLocks[msg.sender];
    }

    /// @inheritdoc IColdStoragePlugin
    function unlockERC721Collection(address[] calldata collections) external {
        for (uint256 i = collections.length; i > 0; --i) {
            erc721Locks[msg.sender].remove(true, collections[i - 1], 0);
        }
    }

    /// @inheritdoc IColdStoragePlugin
    function unlockERC721Token(ERC721Token[] calldata tokens) external {
        for (uint256 i = tokens.length; i > 0; --i) {
            erc721Locks[msg.sender].remove(false, tokens[i - 1].contractAddress, tokens[i].tokenId);
        }
    }

    /// @inheritdoc IColdStoragePlugin
    function storageKeyOf(address account) external view returns (address) {
        return storageKeys[account];
    }

    /// @inheritdoc IColdStoragePlugin
    function isERC721TokenLocked(address account, address collection, uint256 tokenId)
        external
        view
        override
        returns (bool)
    {
        return erc721AllLocks[account] > block.timestamp
            || erc721Locks[msg.sender].get(true, collection, 0).lockEndTime > block.timestamp
            || erc721Locks[msg.sender].get(false, collection, tokenId).lockEndTime > block.timestamp;
    }

    /// @inheritdoc IColdStoragePlugin
    function getERC721Locks(address account) external view returns (uint48 allDuration, ERC721CollectionLock[]
    memory collectionLocks, ERC721TokenLock[] memory tokenLocks) {
        uint256 totalLocks = ERC721LockMapLib.length(erc721Locks[account]);
        ERC721CollectionLock[] memory tempCollectionLocks = new ERC721CollectionLock[](totalLocks);
        ERC721TokenLock[] memory tempTokenLocks = new ERC721TokenLock[](totalLocks);
        uint256 collectionIndex = 0;
        uint256 tokenIndex = 0;

        for (uint256 i = 0; i < totalLocks; ++i) {
            ERC721LockMapLib.ERC721Lock memory lock = ERC721LockMapLib.at(erc721Locks[account], i);
            uint256 lockDuration = lock.lockEndTime > block.timestamp ? lock.lockEndTime - block.timestamp : 0;
            if (lockDuration == 0) continue; // ignore expired locks

            if (lock.isCollectionLock) {
                tempCollectionLocks[collectionIndex] = ERC721CollectionLock({
                    contractAddress: lock.contractAddress,
                    duration: uint48(lockDuration)
                });
                collectionIndex++;
            } else {
                tempTokenLocks[tokenIndex] = ERC721TokenLock({
                    token: ERC721Token({
                        contractAddress: lock.contractAddress,
                        tokenId: lock.tokenId
                    }),
                    duration: uint48(lockDuration)
                });
                tokenIndex++;
            }
        }

        allDuration = erc721AllLocks[account] > block.timestamp ? uint48(erc721AllLocks[account] - block.timestamp) : 0;

        collectionLocks = new ERC721CollectionLock[](collectionIndex);
        for (uint256 i = 0; i < collectionIndex; ++i) {
            collectionLocks[i] = tempCollectionLocks[i];
        }

        tokenLocks = new ERC721TokenLock[](tokenIndex);
        for (uint256 i = 0; i < tokenIndex; ++i) {
            tokenLocks[i] = tempTokenLocks[i];
        }
    }

    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // ┃    Plugin interface functions    ┃
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

    /// @inheritdoc BasePlugin
    function _onInstall(bytes calldata data) internal override isNotInitialized(msg.sender) {
        address storageKey = abi.decode(data, (address));
        storageKeys[msg.sender] = storageKey;
    }

    /// @inheritdoc BasePlugin
    function onUninstall(bytes calldata) external override {
        uint256 totalLocks = erc721Locks[msg.sender].length();
        for (uint256 i = totalLocks; i > 0; --i) { // Do the check in reverse to avoid index issues with removal
            ERC721LockMapLib.ERC721Lock memory lock = erc721Locks[msg.sender].at(i - 1);
            require(lock.lockEndTime <= block.timestamp, "Cannot uninstall while a lock is still active");
            erc721Locks[msg.sender].remove(lock.isCollectionLock, lock.contractAddress, lock.tokenId);
        }
    }

    /// @inheritdoc BasePlugin
    function runtimeValidationFunction(uint8 functionId, address sender, uint256, bytes calldata)
        external
        view
        override
    {
        if (functionId == uint8(FunctionId.RUNTIME_VALIDATION_STORAGE_KEY)) {
            // Validate that the sender is the storage key.
            require(sender == storageKeys[msg.sender]);
            return;
        }
        revert NotImplemented(msg.sig, functionId);
    }

    /// @inheritdoc BasePlugin
    function preExecutionHook(uint8 functionId, address, /* sender */ uint256, /* value */ bytes calldata data)
        external
        view
        override
        returns (bytes memory)
    {
        require(functionId == uint8(FunctionId.EXECUTE_PRE_EXEC_HOOK), "Not a supported function id");
        bytes4 selector = bytes4(data);
        if (
            selector == IStandardExecutor.execute.selector
                || selector == IPluginExecutor.executeFromPluginExternal.selector
        ) {
            (address executeTarget, /* uint256 executeValue */, bytes memory executeData) =
                abi.decode(data[4:], (address, uint256, bytes));
            validateExecution(executeTarget, executeData);
        } else if (selector == IStandardExecutor.executeBatch.selector) {
            (Call[] memory calls) = abi.decode(data[4:], (Call[]));
            for (uint256 i = 0; i < calls.length; i++) {
                Call memory call = calls[i];
                validateExecution(call.target, call.data);
            }
        }
        return bytes("");
    }

    function validateExecution(address target, bytes memory data) internal view {
        bytes4 selector = bytes4(data);
        if (!isErc721LockedFunction(selector)) {
            return;
        }
        require(erc721AllLocks[msg.sender] <= block.timestamp, "ERC721 locked");
        require(erc721Locks[msg.sender].get(true, target, 0).lockEndTime <= block.timestamp, "ERC721 collection locked");

        bytes memory toDecode = this.removeSelector(data);

        // check if there is an NFT transfer
        if (selector == IERC721.approve.selector) {
            (/* address to */, uint256 tokenId) = abi.decode(toDecode, (address, uint256));
            require(
                erc721Locks[msg.sender].get(false, target, tokenId).lockEndTime <= block.timestamp, "ERC721 collection locked"
            );
        } else if (selector == SAFE_TRANSFER_FROM) {
            (address from, /* address to */, uint256 tokenId) = abi.decode(toDecode, (address, address, uint256));
            if (from == msg.sender) {
                require(
                    erc721Locks[msg.sender].get(false, target, tokenId).lockEndTime <= block.timestamp,
                    "ERC721 collection locked"
                );
            }
        } else if (selector == SAFE_TRANSFER_FROM_WITH_DATA) {
            (address from, /* address to */, uint256 tokenId, /* bytes memory transferData */ ) =
                abi.decode(toDecode, (address, address, uint256, bytes));
            if (from == msg.sender) {
                require(
                    erc721Locks[msg.sender].get(false, target, tokenId).lockEndTime <= block.timestamp,
                    "ERC721 collection locked"
                );
            }
        } else {
            // TRANSFER_FROM
            (address from, /* address to */, uint256 tokenId) = abi.decode(toDecode, (address, address, uint256));
            if (from == msg.sender) {
                require(
                    erc721Locks[msg.sender].get(false, target, tokenId).lockEndTime <= block.timestamp,
                    "ERC721 collection locked"
                );
            }
        }
    }

    /// @inheritdoc BasePlugin
    function pluginManifest() external pure override returns (PluginManifest memory) {
        PluginManifest memory manifest;

        manifest.dependencyInterfaceIds = new bytes4[](2);
        manifest.dependencyInterfaceIds[_MANIFEST_DEPENDENCY_INDEX_OWNER_RUNTIME_VALIDATION] =
            type(IPlugin).interfaceId;
        manifest.dependencyInterfaceIds[_MANIFEST_DEPENDENCY_INDEX_OWNER_USER_OP_VALIDATION] =
            type(IPlugin).interfaceId;

        manifest.executionFunctions = new bytes4[](8);
        manifest.executionFunctions[0] = this.executeWithStorageKey.selector;
        manifest.executionFunctions[1] = this.changeStorageKey.selector;
        manifest.executionFunctions[2] = this.lockERC721All.selector;
        manifest.executionFunctions[3] = this.lockERC721Collection.selector;
        manifest.executionFunctions[4] = this.lockERC721Token.selector;
        manifest.executionFunctions[5] = this.unlockERC721All.selector;
        manifest.executionFunctions[6] = this.unlockERC721Collection.selector;
        manifest.executionFunctions[7] = this.unlockERC721Token.selector;

        ManifestFunction memory storageKeyUserOpValidationFunction = ManifestFunction({
            functionType: ManifestAssociatedFunctionType.SELF,
            functionId: uint8(FunctionId.USER_OP_VALIDATION_STORAGE_KEY),
            dependencyIndex: 0 // Unused.
        });
        ManifestFunction memory ownerUserOpValidationFunction = ManifestFunction({
            functionType: ManifestAssociatedFunctionType.DEPENDENCY,
            functionId: 0, // unused since it's a dependency
            dependencyIndex: _MANIFEST_DEPENDENCY_INDEX_OWNER_USER_OP_VALIDATION
        });

        manifest.userOpValidationFunctions = new ManifestAssociatedFunction[](8);
        manifest.userOpValidationFunctions[0] = ManifestAssociatedFunction({
            executionSelector: this.executeWithStorageKey.selector,
            associatedFunction: storageKeyUserOpValidationFunction
        });
        manifest.userOpValidationFunctions[1] = ManifestAssociatedFunction({
            executionSelector: this.changeStorageKey.selector,
            associatedFunction: storageKeyUserOpValidationFunction
        });
        manifest.userOpValidationFunctions[2] = ManifestAssociatedFunction({
            executionSelector: this.lockERC721All.selector,
            associatedFunction: ownerUserOpValidationFunction
        });
        manifest.userOpValidationFunctions[3] = ManifestAssociatedFunction({
            executionSelector: this.lockERC721Collection.selector,
            associatedFunction: ownerUserOpValidationFunction
        });
        manifest.userOpValidationFunctions[4] = ManifestAssociatedFunction({
            executionSelector: this.lockERC721Token.selector,
            associatedFunction: ownerUserOpValidationFunction
        });
        manifest.userOpValidationFunctions[5] = ManifestAssociatedFunction({
            executionSelector: this.unlockERC721All.selector,
            associatedFunction: storageKeyUserOpValidationFunction
        });
        manifest.userOpValidationFunctions[6] = ManifestAssociatedFunction({
            executionSelector: this.unlockERC721Collection.selector,
            associatedFunction: storageKeyUserOpValidationFunction
        });
        manifest.userOpValidationFunctions[7] = ManifestAssociatedFunction({
            executionSelector: this.unlockERC721Token.selector,
            associatedFunction: storageKeyUserOpValidationFunction
        });

        ManifestFunction memory storageKeyRuntimeValidationFunction = ManifestFunction({
            functionType: ManifestAssociatedFunctionType.SELF,
            functionId: uint8(FunctionId.RUNTIME_VALIDATION_STORAGE_KEY),
            dependencyIndex: 0 // Unused.
        });
        ManifestFunction memory ownerRuntimeValidationFunction = ManifestFunction({
            functionType: ManifestAssociatedFunctionType.DEPENDENCY,
            functionId: 0, // unused since it's a dependency
            dependencyIndex: _MANIFEST_DEPENDENCY_INDEX_OWNER_RUNTIME_VALIDATION
        });

        manifest.runtimeValidationFunctions = new ManifestAssociatedFunction[](8);
        manifest.runtimeValidationFunctions[0] = ManifestAssociatedFunction({
            executionSelector: this.executeWithStorageKey.selector,
            associatedFunction: storageKeyRuntimeValidationFunction
        });
        manifest.runtimeValidationFunctions[1] = ManifestAssociatedFunction({
            executionSelector: this.changeStorageKey.selector,
            associatedFunction: storageKeyRuntimeValidationFunction
        });
        manifest.runtimeValidationFunctions[2] = ManifestAssociatedFunction({
            executionSelector: this.lockERC721All.selector,
            associatedFunction: ownerRuntimeValidationFunction
        });
        manifest.runtimeValidationFunctions[3] = ManifestAssociatedFunction({
            executionSelector: this.lockERC721Collection.selector,
            associatedFunction: ownerRuntimeValidationFunction
        });
        manifest.runtimeValidationFunctions[4] = ManifestAssociatedFunction({
            executionSelector: this.lockERC721Token.selector,
            associatedFunction: ownerRuntimeValidationFunction
        });
        manifest.runtimeValidationFunctions[5] = ManifestAssociatedFunction({
            executionSelector: this.unlockERC721All.selector,
            associatedFunction: storageKeyRuntimeValidationFunction
        });
        manifest.runtimeValidationFunctions[6] = ManifestAssociatedFunction({
            executionSelector: this.unlockERC721Collection.selector,
            associatedFunction: storageKeyRuntimeValidationFunction
        });        
        manifest.runtimeValidationFunctions[7] = ManifestAssociatedFunction({
            executionSelector: this.unlockERC721Token.selector,
            associatedFunction: storageKeyRuntimeValidationFunction
        });

        ManifestFunction memory preExecHook = ManifestFunction({
            functionType: ManifestAssociatedFunctionType.SELF,
            functionId: uint8(FunctionId.EXECUTE_PRE_EXEC_HOOK),
            dependencyIndex: 0 // Unused.
        });
        ManifestFunction memory postExecHook = ManifestFunction({
            functionType: ManifestAssociatedFunctionType.NONE,
            functionId: 0, // Unused.
            dependencyIndex: 0 // Unused.
        });

        manifest.executionHooks = new ManifestExecutionHook[](3);
        manifest.executionHooks[0] = ManifestExecutionHook({
            executionSelector: IStandardExecutor.execute.selector,
            preExecHook: preExecHook,
            postExecHook: postExecHook
        });
        manifest.executionHooks[1] = ManifestExecutionHook({
            executionSelector: IStandardExecutor.executeBatch.selector,
            preExecHook: preExecHook,
            postExecHook: postExecHook
        });
        manifest.executionHooks[2] = ManifestExecutionHook({
            executionSelector: IPluginExecutor.executeFromPluginExternal.selector,
            preExecHook: preExecHook,
            postExecHook: postExecHook
        });

        return manifest;
    }

    /// @inheritdoc BasePlugin
    function pluginMetadata() external pure virtual override returns (PluginMetadata memory) {
        PluginMetadata memory metadata;
        metadata.name = _NAME;
        metadata.version = _VERSION;
        metadata.author = _AUTHOR;

        return metadata;
    }

    // ┏━━━━━━━━━━━━━━━┓
    // ┃    EIP-165    ┃
    // ┗━━━━━━━━━━━━━━━┛

    /// @inheritdoc BasePlugin
    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        return interfaceId == type(IColdStoragePlugin).interfaceId || super.supportsInterface(interfaceId);
    }

    function isErc721LockedFunction(bytes4 selector) internal view returns (bool) {
        return selector == IERC721.approve.selector || selector == SAFE_TRANSFER_FROM
            || selector == SAFE_TRANSFER_FROM_WITH_DATA || selector == IERC721.transferFrom.selector;
    }

    function removeSelector(bytes calldata data) external pure returns (bytes memory) {
        return data[4:];
    }
}

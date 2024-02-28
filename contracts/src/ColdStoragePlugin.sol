// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import {BasePlugin} from "modular-account/plugins/BasePlugin.sol";
import {
    PluginManifest,
    PluginMetadata
} from "modular-account/interfaces/IPlugin.sol";
import {IColdStoragePlugin} from "./IColdStoragePlugin.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Call} from "modular-account/interfaces/IStandardExecutor.sol";
import {IPluginExecutor} from "modular-account/interfaces/IPluginExecutor.sol";

contract ColdStoragePlugin is IColdStoragePlugin, BasePlugin {
    string internal constant _NAME = "Cold Storage Plugin";
    string internal constant _VERSION = "0.1.0";
    string internal constant _AUTHOR = "Alchemy";

    mapping(address => address) public storageKeys;
    mapping(address => uint256) public erc721AllLocks;
    mapping(address => mapping(address => uint256)) public erc721CollectionLocks;
    mapping(address => mapping(address => mapping(uint => uint256))) public erc721TokenLocks;

    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // ┃    Execution functions    ┃
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

    bytes4 constant SAFE_TRANSFER_FROM = 0x42842e0e;
    bytes4 constant SAFE_TRANSFER_FROM_WITH_DATA = 0xb88d4fde;

    bytes4 constant EXECUTE = 0xb61d27f6;

    /// @inheritdoc IColdStoragePlugin
    function executeWithStorageKey(Call[] calldata calls, address storageKey) external returns (bytes[] memory) {
        uint256 callsLength = calls.length;
        bytes[] memory results = new bytes[](callsLength);

        for (uint256 i = 0; i < callsLength; ++i) {
            Call calldata call = calls[i];
            // Only allow the cold storage key to execute transfers and approvals of NFTs, the methods that are currently locked.
            // TODO: Check to make sure that you are only dealing wth locked tokens and are only for transfers from self.
            require(call.data.length >= 4 && isErc721LockedFunction(bytes4(call.data)), "Call must be approve, safeTransferFrom, or transferFrom");
            results[i] = IPluginExecutor(msg.sender).executeFromPluginExternal(call.target, call.value, call.data);
        }
    }

    /// @inheritdoc IColdStoragePlugin
    function addOrReplaceStorageKey(address storageKey) external {
        require(storageKeys[msg.sender] == address(0), "Storage key already exists");
        storageKeys[msg.sender] = storageKey;
    }

    /// @inheritdoc IColdStoragePlugin
    function removeStorageKey() external {
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
                    && erc721CollectionLocks[msg.sender][lock.contractAddress] <= block.timestamp,
                "Existing lock in place"
            );

            erc721CollectionLocks[msg.sender][lock.contractAddress] = block.timestamp + lock.duration;
            emit ERC721Locked(msg.sender, lock.duration);  
        }
    }

    /// @inheritdoc IColdStoragePlugin
    function lockERC721Token(ERC721TokenLock[] calldata locks) external {
        for (uint256 i = 0; i < locks.length; ++i) {
            ERC721TokenLock calldata lock = locks[i];
            require(
                erc721AllLocks[msg.sender] <= block.timestamp 
                    && erc721CollectionLocks[msg.sender][lock.token.contractAddress] <= block.timestamp 
                    && erc721TokenLocks[msg.sender][lock.token.contractAddress][lock.token.tokenId] <= block.timestamp,
                "Existing lock in place"
            );

            erc721TokenLocks[msg.sender][lock.token.contractAddress][lock.token.tokenId] = block.timestamp + lock.duration;
        }
    }

    /// @inheritdoc IColdStoragePlugin
    function storageKeyOf(address account) external view returns (address) {
        return storageKeys[account];
    }

    // /// @inheritdoc IColdStoragePlugin
    // function getERC721Locks(address account) external view returns (uint256 allDuration, ERC721CollectionLock[] memory collectionLocks, ERC721TokenLock[] memory tokenLocks) {
    //     allDuration = erc721AllLocks[account];
    //     collectionLocks = erc721CollectionLocks[account];
    //     tokenLocks = erc721TokenLocks[account];
    //     return (allDuration, collectionLocks, tokenLocks);
    // }




    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // ┃    Plugin interface functions    ┃
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

    /// @inheritdoc BasePlugin
    function _onInstall(bytes calldata data) internal override isNotInitialized(msg.sender) {
        
    }

    /// @inheritdoc BasePlugin
    function onUninstall(bytes calldata) external override {
        
    }

    /// @inheritdoc BasePlugin
    function preExecutionHook(uint8 functionId, address sender, uint256 value, bytes calldata data)
        external
        override
        returns (bytes memory)
    {
        bytes4 selector = bytes4(data);

        if (selector != EXECUTE) {
            return bytes("");
        }
        
        (address executeTarget, uint256 executeValue, bytes memory executeData) = abi.decode(data[4:], (address, uint256, bytes));

        bytes4 executeSelector = bytes4(executeData);
        if (!isErc721LockedFunction(executeSelector)) {
            return bytes("");
        }

        require(erc721AllLocks[sender] <= block.timestamp, "ERC721 locked");
        require(erc721CollectionLocks[sender][executeTarget] <= block.timestamp, "ERC721 collection locked");


        bytes memory toDecode = this.removeSelector(executeData);


        // check if there is an NFT transfer
        if (selector == IERC721.approve.selector) {
            (address to, uint256 tokenId) = abi.decode(toDecode, (address, uint256));
            require(erc721TokenLocks[sender][executeTarget][tokenId] <= block.timestamp, "ERC721 collection locked");
        } else if (selector == SAFE_TRANSFER_FROM) {
            (address from, address to, uint256 tokenId) = abi.decode(toDecode, (address, address, uint256));
            if (from == msg.sender) {
                require(erc721TokenLocks[sender][executeTarget][tokenId] <= block.timestamp, "ERC721 collection locked");
            }
        } else if (selector == SAFE_TRANSFER_FROM_WITH_DATA) {
            (address from, address to, uint256 tokenId, bytes memory transferData) = abi.decode(toDecode, (address, address, uint256, bytes));
            if (from == msg.sender) {
                require(erc721TokenLocks[sender][executeTarget][tokenId] <= block.timestamp, "ERC721 collection locked");
            }
        } else { // TRANSFER_FROM
            (address from, address to, uint256 tokenId) = abi.decode(toDecode, (address, address, uint256));
            if (from == msg.sender) {
                require(erc721TokenLocks[sender][executeTarget][tokenId] <= block.timestamp, "ERC721 collection locked");
            }
        }
    }

    /// @inheritdoc BasePlugin
    function pluginManifest() external pure override returns (PluginManifest memory) {
        PluginManifest memory manifest;

        // manifest.preRuntimeValidationHooks = new PluginManifestAssociatedFunction[](1);
        // manifest.preRuntimeValidationHooks[0] = PluginManifestAssociatedFunction({
        //     // excecutionSelector: this.selector,
        //     // associatedFunction:
        // });

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

    function isErc721LockedFunction(bytes4 selector) internal returns (bool) {
        return selector == IERC721.approve.selector || selector == SAFE_TRANSFER_FROM || selector == SAFE_TRANSFER_FROM_WITH_DATA || selector == IERC721.transferFrom.selector;
    }

    function removeSelector(bytes calldata data) external pure returns (bytes memory) {
        return data[4:];
    } 

}

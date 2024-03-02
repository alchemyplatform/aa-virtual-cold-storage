// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import {Call} from "modular-account/interfaces/IStandardExecutor.sol";

interface IColdStoragePlugin {
    enum FunctionId {
        USER_OP_VALIDATION_STORAGE_KEY,
        RUNTIME_VALIDATION_STORAGE_KEY,
        EXECUTE_PRE_EXEC_HOOK
    }

    struct ERC721Token {
        address contractAddress;
        uint256 tokenId;
    }

    struct ERC721CollectionLock {
        address contractAddress;
        uint48 duration;
    }

    struct ERC721TokenLock {
        ERC721Token token;
        uint48 duration;
    }

    /// @notice Emitted when a storage key is replaced. The zero address represents no storage key.
    /// @param account The account that added the storage key.
    /// @param oldStorageKey The address of the old storage key.
    /// @param newStorageKey The address of the new storage key.
    event StorageKeyChanged(address indexed account, address indexed oldStorageKey, address indexed newStorageKey);

    /// @notice Emitted when all ERC721 tokens are locked.
    /// @param account The account that added the storage key.
    /// @param duration How long to lock all ERC721s for.
    event ERC721Locked(address indexed account, uint48 duration);

    /// @notice Emitted when collections are locked.
    /// @param account The account that added the storage key.
    /// @param locks The locks that are being placed on ERC721 collections.
    event ERC721CollectionsLocked(address indexed account, ERC721CollectionLock[] locks);

    /// @notice Emitted when tokens are locked.
    /// @param account The account that added the storage key.
    /// @param locks The locks that are being placed on ERC721 tokens.
    event ERC721TokensLocked(address indexed account, ERC721TokenLock[] locks);

    error ColdStorageAccessDenied();

    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // ┃    Execution functions    ┃
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

    /// @notice Execute transfers or approvals on locked assets with the cold storage key.
    /// @param calls The array of calls to be performed.
    /// @param storageKey The storage key to be used for the execution.
    /// @return The array of return data from the executions.
    function executeWithStorageKey(Call[] calldata calls, address storageKey) external returns (bytes[] memory);

    /// @notice Replace a storage key for the sender.
    /// @param storageKey The storage key replace the current key with.
    function changeStorageKey(address account, address storageKey) external;

    /// @notice Place all ERC721 tokens in cold storage.
    /// @param duration how long to lock the tokens for.
    function lockERC721All(uint48 duration) external;

    /// @notice Place the specified ERC721 collections in cold storage.
    /// @param locks The collections and durations to lock.
    function lockERC721Collection(ERC721CollectionLock[] calldata locks) external;

    /// @notice Place the specified ERC721 tokens in cold storage.
    /// @param locks The tokens and durations to lock.
    function lockERC721Token(ERC721TokenLock[] calldata locks) external;

    /// @notice Remove all locks on ERC721 tokens.
    function unlockERC721All() external;

    /// @notice Remove all locks on specific ERC721 collections.
    /// @param collections The collections to unlock.
    function unlockERC721Collection(address[] calldata collections) external;

    /// @notice Remove locks on specific ERC721 tokens.
    /// @param tokens The tokens to unlock.
    function unlockERC721Token(ERC721Token[] calldata tokens) external;

    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // ┃    Plugin only view functions    ┃
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

    /// @notice Get the owners of `account`.
    /// @param account The account to get the owners of.
    /// @return The addresses of the owners of the account.
    function storageKeyOf(address account) external view returns (address);

    /// @notice Determine if a particular ERC721 token is locked, which can be because it is individually locked,
    /// because its collection is locked, or because all ERC721 tokens are locked.
    /// @param account The account on which to check if the token is locked.
    /// @param collection The ERC721 contract address.
    /// @param tokenId The ERC721 token id.
    /// @return true if the token is locked.
    function isERC721TokenLocked(address account, address collection, uint256 tokenId)
        external
        view
        returns (bool);

    /// @notice Returns all the active locks for the account.
    /// @param account SCA to get all the locks for
    /// @return allDuration The duration of the lock on all ERC721 tokens, 0 if there is no lock
    /// @return collectionLocks The locks on ERC721 collections
    /// @return tokenLocks The locks on ERC721 tokens
    function getERC721Locks(address account) external view returns (uint48 allDuration, ERC721CollectionLock[] memory collectionLocks, ERC721TokenLock[] memory tokenLocks);
}

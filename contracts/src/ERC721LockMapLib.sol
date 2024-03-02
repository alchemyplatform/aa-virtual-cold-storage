// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

library ERC721LockMapLib {
    using EnumerableSet for EnumerableSet.Bytes32Set;

    struct ERC721Lock {
        bool isCollectionLock;
        address contractAddress;
        uint256 tokenId;
        uint256 lockEndTime;
    }

    struct ERC721LockMap {
        EnumerableSet.Bytes32Set _hashedKeys;
        mapping(bytes32 => ERC721Lock) _keysToLocks;
    }

    function set(
        ERC721LockMap storage map,
        bool isCollectionLock,
        address contractAddress,
        uint256 tokenId,
        uint256 lockEndTime
    ) internal {
        bytes32 key = keccak256(abi.encodePacked(isCollectionLock, contractAddress, tokenId));
        map._hashedKeys.add(key);
        map._keysToLocks[key] = ERC721Lock({
            isCollectionLock: isCollectionLock,
            contractAddress: contractAddress,
            tokenId: tokenId,
            lockEndTime: lockEndTime
        });
    }

    function get(ERC721LockMap storage map, bool isCollectionLock, address contractAddress, uint256 tokenId)
        internal
        view
        returns (ERC721Lock memory)
    {
        bytes32 key = keccak256(abi.encodePacked(isCollectionLock, contractAddress, tokenId));
        return map._keysToLocks[key];
    }

    function length(ERC721LockMap storage map) internal view returns (uint256) {
        return map._hashedKeys.length();
    }

    function at(ERC721LockMap storage map, uint256 index) internal view returns (ERC721Lock memory) {
        return map._keysToLocks[map._hashedKeys.at(index)];
    }

    function remove(ERC721LockMap storage map, bool isCollectionLock, address contractAddress, uint256 tokenId)
        internal
    {
        bytes32 key = keccak256(abi.encodePacked(isCollectionLock, contractAddress, tokenId));
        map._hashedKeys.remove(key);
        delete map._keysToLocks[key];
    }

    function contains(ERC721LockMap storage map, bool isCollectionLock, address contractAddress, uint256 tokenId)
        internal
        view
        returns (bool)
    {
        bytes32 key = keccak256(abi.encodePacked(isCollectionLock, contractAddress, tokenId));
        return map._hashedKeys.contains(key);
    }
}

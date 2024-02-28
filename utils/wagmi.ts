// @ts-nocheck
import {
  createReadContract,
  createSimulateContract,
  createWatchContractEvent,
  createWriteContract
} from 'wagmi/codegen';

import {
  createUseReadContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
  createUseWriteContract
} from 'wagmi/codegen';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FreelyMintableNft
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const freelyMintableNftAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' }
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'quantity', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' }
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenByIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'index', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'approved',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true
      }
    ],
    name: 'Approval'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false }
    ],
    name: 'ApprovalForAll'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true
      }
    ],
    name: 'Transfer'
  }
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link freelyMintableNftAbi}__
 */
export const readFreelyMintableNft = /*#__PURE__*/ createReadContract({
  abi: freelyMintableNftAbi
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readFreelyMintableNftBalanceOf = /*#__PURE__*/ createReadContract({
  abi: freelyMintableNftAbi,
  functionName: 'balanceOf'
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"getApproved"`
 */
export const readFreelyMintableNftGetApproved = /*#__PURE__*/ createReadContract({
  abi: freelyMintableNftAbi,
  functionName: 'getApproved'
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const readFreelyMintableNftIsApprovedForAll = /*#__PURE__*/ createReadContract({
  abi: freelyMintableNftAbi,
  functionName: 'isApprovedForAll'
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"name"`
 */
export const readFreelyMintableNftName = /*#__PURE__*/ createReadContract({
  abi: freelyMintableNftAbi,
  functionName: 'name'
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"ownerOf"`
 */
export const readFreelyMintableNftOwnerOf = /*#__PURE__*/ createReadContract({
  abi: freelyMintableNftAbi,
  functionName: 'ownerOf'
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const readFreelyMintableNftSupportsInterface = /*#__PURE__*/ createReadContract({
  abi: freelyMintableNftAbi,
  functionName: 'supportsInterface'
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"symbol"`
 */
export const readFreelyMintableNftSymbol = /*#__PURE__*/ createReadContract({
  abi: freelyMintableNftAbi,
  functionName: 'symbol'
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"tokenByIndex"`
 */
export const readFreelyMintableNftTokenByIndex = /*#__PURE__*/ createReadContract({
  abi: freelyMintableNftAbi,
  functionName: 'tokenByIndex'
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"tokenOfOwnerByIndex"`
 */
export const readFreelyMintableNftTokenOfOwnerByIndex = /*#__PURE__*/ createReadContract({
  abi: freelyMintableNftAbi,
  functionName: 'tokenOfOwnerByIndex'
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"tokenURI"`
 */
export const readFreelyMintableNftTokenUri = /*#__PURE__*/ createReadContract({
  abi: freelyMintableNftAbi,
  functionName: 'tokenURI'
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"totalSupply"`
 */
export const readFreelyMintableNftTotalSupply = /*#__PURE__*/ createReadContract({
  abi: freelyMintableNftAbi,
  functionName: 'totalSupply'
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link freelyMintableNftAbi}__
 */
export const writeFreelyMintableNft = /*#__PURE__*/ createWriteContract({
  abi: freelyMintableNftAbi
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"approve"`
 */
export const writeFreelyMintableNftApprove = /*#__PURE__*/ createWriteContract({
  abi: freelyMintableNftAbi,
  functionName: 'approve'
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"burn"`
 */
export const writeFreelyMintableNftBurn = /*#__PURE__*/ createWriteContract({
  abi: freelyMintableNftAbi,
  functionName: 'burn'
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"mint"`
 */
export const writeFreelyMintableNftMint = /*#__PURE__*/ createWriteContract({
  abi: freelyMintableNftAbi,
  functionName: 'mint'
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const writeFreelyMintableNftSafeTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: freelyMintableNftAbi,
  functionName: 'safeTransferFrom'
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const writeFreelyMintableNftSetApprovalForAll = /*#__PURE__*/ createWriteContract({
  abi: freelyMintableNftAbi,
  functionName: 'setApprovalForAll'
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"transferFrom"`
 */
export const writeFreelyMintableNftTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: freelyMintableNftAbi,
  functionName: 'transferFrom'
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link freelyMintableNftAbi}__
 */
export const simulateFreelyMintableNft = /*#__PURE__*/ createSimulateContract({
  abi: freelyMintableNftAbi
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"approve"`
 */
export const simulateFreelyMintableNftApprove = /*#__PURE__*/ createSimulateContract({
  abi: freelyMintableNftAbi,
  functionName: 'approve'
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"burn"`
 */
export const simulateFreelyMintableNftBurn = /*#__PURE__*/ createSimulateContract({
  abi: freelyMintableNftAbi,
  functionName: 'burn'
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"mint"`
 */
export const simulateFreelyMintableNftMint = /*#__PURE__*/ createSimulateContract({
  abi: freelyMintableNftAbi,
  functionName: 'mint'
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const simulateFreelyMintableNftSafeTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: freelyMintableNftAbi,
  functionName: 'safeTransferFrom'
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const simulateFreelyMintableNftSetApprovalForAll = /*#__PURE__*/ createSimulateContract({
  abi: freelyMintableNftAbi,
  functionName: 'setApprovalForAll'
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateFreelyMintableNftTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: freelyMintableNftAbi,
  functionName: 'transferFrom'
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link freelyMintableNftAbi}__
 */
export const watchFreelyMintableNftEvent = /*#__PURE__*/ createWatchContractEvent({ abi: freelyMintableNftAbi });

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `eventName` set to `"Approval"`
 */
export const watchFreelyMintableNftApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: freelyMintableNftAbi,
  eventName: 'Approval'
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const watchFreelyMintableNftApprovalForAllEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: freelyMintableNftAbi,
  eventName: 'ApprovalForAll'
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `eventName` set to `"Transfer"`
 */
export const watchFreelyMintableNftTransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: freelyMintableNftAbi,
  eventName: 'Transfer'
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link freelyMintableNftAbi}__
 */
export const useReadFreelyMintableNft = /*#__PURE__*/ createUseReadContract({
  abi: freelyMintableNftAbi
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadFreelyMintableNftBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: freelyMintableNftAbi,
  functionName: 'balanceOf'
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"getApproved"`
 */
export const useReadFreelyMintableNftGetApproved = /*#__PURE__*/ createUseReadContract({
  abi: freelyMintableNftAbi,
  functionName: 'getApproved'
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadFreelyMintableNftIsApprovedForAll = /*#__PURE__*/ createUseReadContract({
  abi: freelyMintableNftAbi,
  functionName: 'isApprovedForAll'
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"name"`
 */
export const useReadFreelyMintableNftName = /*#__PURE__*/ createUseReadContract({
  abi: freelyMintableNftAbi,
  functionName: 'name'
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"ownerOf"`
 */
export const useReadFreelyMintableNftOwnerOf = /*#__PURE__*/ createUseReadContract({
  abi: freelyMintableNftAbi,
  functionName: 'ownerOf'
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadFreelyMintableNftSupportsInterface = /*#__PURE__*/ createUseReadContract({
  abi: freelyMintableNftAbi,
  functionName: 'supportsInterface'
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadFreelyMintableNftSymbol = /*#__PURE__*/ createUseReadContract({
  abi: freelyMintableNftAbi,
  functionName: 'symbol'
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"tokenByIndex"`
 */
export const useReadFreelyMintableNftTokenByIndex = /*#__PURE__*/ createUseReadContract({
  abi: freelyMintableNftAbi,
  functionName: 'tokenByIndex'
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"tokenOfOwnerByIndex"`
 */
export const useReadFreelyMintableNftTokenOfOwnerByIndex = /*#__PURE__*/ createUseReadContract({
  abi: freelyMintableNftAbi,
  functionName: 'tokenOfOwnerByIndex'
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"tokenURI"`
 */
export const useReadFreelyMintableNftTokenUri = /*#__PURE__*/ createUseReadContract({
  abi: freelyMintableNftAbi,
  functionName: 'tokenURI'
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadFreelyMintableNftTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: freelyMintableNftAbi,
  functionName: 'totalSupply'
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link freelyMintableNftAbi}__
 */
export const useWriteFreelyMintableNft = /*#__PURE__*/ createUseWriteContract({
  abi: freelyMintableNftAbi
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteFreelyMintableNftApprove = /*#__PURE__*/ createUseWriteContract({
  abi: freelyMintableNftAbi,
  functionName: 'approve'
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteFreelyMintableNftBurn = /*#__PURE__*/ createUseWriteContract({
  abi: freelyMintableNftAbi,
  functionName: 'burn'
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteFreelyMintableNftMint = /*#__PURE__*/ createUseWriteContract({
  abi: freelyMintableNftAbi,
  functionName: 'mint'
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteFreelyMintableNftSafeTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: freelyMintableNftAbi,
  functionName: 'safeTransferFrom'
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteFreelyMintableNftSetApprovalForAll = /*#__PURE__*/ createUseWriteContract({
  abi: freelyMintableNftAbi,
  functionName: 'setApprovalForAll'
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteFreelyMintableNftTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: freelyMintableNftAbi,
  functionName: 'transferFrom'
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link freelyMintableNftAbi}__
 */
export const useSimulateFreelyMintableNft = /*#__PURE__*/ createUseSimulateContract({ abi: freelyMintableNftAbi });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateFreelyMintableNftApprove = /*#__PURE__*/ createUseSimulateContract({
  abi: freelyMintableNftAbi,
  functionName: 'approve'
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateFreelyMintableNftBurn = /*#__PURE__*/ createUseSimulateContract({
  abi: freelyMintableNftAbi,
  functionName: 'burn'
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateFreelyMintableNftMint = /*#__PURE__*/ createUseSimulateContract({
  abi: freelyMintableNftAbi,
  functionName: 'mint'
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateFreelyMintableNftSafeTransferFrom = /*#__PURE__*/ createUseSimulateContract({
  abi: freelyMintableNftAbi,
  functionName: 'safeTransferFrom'
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateFreelyMintableNftSetApprovalForAll = /*#__PURE__*/ createUseSimulateContract({
  abi: freelyMintableNftAbi,
  functionName: 'setApprovalForAll'
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateFreelyMintableNftTransferFrom = /*#__PURE__*/ createUseSimulateContract({
  abi: freelyMintableNftAbi,
  functionName: 'transferFrom'
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link freelyMintableNftAbi}__
 */
export const useWatchFreelyMintableNftEvent = /*#__PURE__*/ createUseWatchContractEvent({ abi: freelyMintableNftAbi });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchFreelyMintableNftApprovalEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: freelyMintableNftAbi,
  eventName: 'Approval'
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchFreelyMintableNftApprovalForAllEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: freelyMintableNftAbi,
  eventName: 'ApprovalForAll'
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link freelyMintableNftAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchFreelyMintableNftTransferEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: freelyMintableNftAbi,
  eventName: 'Transfer'
});

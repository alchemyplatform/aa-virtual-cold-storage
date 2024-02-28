// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {DeployColdStorage} from "./DeployColdStorage.sol";

contract DeployForReal is Script, DeployColdStorage {
    function run() external {
        _deployColdStorageContracts(vm.envUint("PRIVATE_KEY"), "deployed.ts", "DEPLOYED", false);
    }
}

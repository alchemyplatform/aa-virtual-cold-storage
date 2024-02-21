// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {BasePlugin} from "modular-account/plugins/BasePlugin.sol";
import {
    PluginManifest,
    PluginMetadata
} from "modular-account/interfaces/IPlugin.sol";
import {IColdStoragePlugin} from "./IColdStoragePlugin.sol";

contract ColdStoragePlugin is BasePlugin {
    uint256 public number;


    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // ┃    Execution functions    ┃
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛




    // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    // ┃    Plugin interface functions    ┃
    // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

    /// @inheritdoc BasePlugin
    function _onInstall(bytes calldata data) internal override isNotInitialized(msg.sender) {}

    /// @inheritdoc BasePlugin
    function onUninstall(bytes calldata) external override {}

    /// @inheritdoc BasePlugin
    function pluginManifest() external pure override returns (PluginManifest memory) {}

    /// @inheritdoc BasePlugin
    function pluginMetadata() external pure virtual override returns (PluginMetadata memory) {}

    // ┏━━━━━━━━━━━━━━━┓
    // ┃    EIP-165    ┃
    // ┗━━━━━━━━━━━━━━━┛

    /// @inheritdoc BasePlugin
    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        return interfaceId == type(IColdStoragePlugin).interfaceId || super.supportsInterface(interfaceId);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
library LibSomeStorage2 {

        struct StorageInfo {
            // address user;     
            uint256 startTime;
        }

        // This struct contains a mapping from TokenID to struct.
        struct SomeStorage {
            // mapping of nftAddress to token id to StoringInfo  
            mapping(address => StorageInfo) storingInfo;
            mapping(address => bool) registered;
            uint totalUsers;
            bool initialized;
        }

        // Returns the struct from a specified position in contract storage
        // ds is short for DiamondStorage
        function diamondStorage() internal pure returns(SomeStorage storage ds) {
            // Specifies a random position from a hash of a string
            bytes32 storagePosition = keccak256("diamond.storage.LibSomeStorage");
            // Set the position of our struct in contract storage
            assembly {
                ds.slot := storagePosition
            }
        }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libraries/LibSomeStorage2.sol";
import "../libraries/LibNiceStorage2.sol";
import "../libraries/LibRelevantFunctions.sol";

import "hardhat/console.sol";

contract Test4Facet {
    NiceStorage internal s;

    function initial(uint users) external {

        LibSomeStorage2.SomeStorage storage ls = LibSomeStorage2.diamondStorage();
        require(!ls.initialized, "Already Initialized");
        ls.initialized = true;
        ls.totalUsers = users;

    }

    function decreasePoints() external {
        
        uint expiryTime = LibRelevantFunctions._getExpiryTime();
        require(expiryTime > block.timestamp, "Expired");
        s.points[msg.sender] -= 1;

    }

    function newIncreasePoints() external {
        
        increasePoints();

    }

    function increasePoints() internal {
        
        LibSomeStorage2.SomeStorage storage ls = LibSomeStorage2.diamondStorage();
        LibSomeStorage2.StorageInfo storage lss = ls.storingInfo[msg.sender];
        
        uint expiryTime = LibRelevantFunctions._getExpiryTime();
        require(expiryTime > block.timestamp, "Expired");
        require(expiryTime > lss.startTime, "Not Valid");
        s.points[msg.sender] += 1;

    }

    function getInitialzied() external view returns(bool, uint) {

        LibSomeStorage2.SomeStorage storage ls = LibSomeStorage2.diamondStorage();
        return (ls.initialized, ls.totalUsers);
        
    }

    
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libraries/LibSomeStorage2.sol";
import "../libraries/LibNiceStorage2.sol";
import "../libraries/LibRelevantFunctions.sol";

import "hardhat/console.sol";

contract Test3Facet {
    NiceStorage internal s;

    function increasePoints() external {

        
        uint expiryTime = LibRelevantFunctions._getExpiryTime();
        require(expiryTime > block.timestamp, "Expired");
        s.points[msg.sender] += 1;

    }

    function getPoints() external view returns(uint){

        return s.points[msg.sender];

    }

    
}

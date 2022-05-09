//  SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LibNiceStorage2.sol";

library LibRelevantFunctions{

    
    function _getExpiryTime() internal view returns(uint){

        NiceStorage storage s  = LibNiceStorage2.diamondStorage();
        return s.expiryTime[msg.sender];

    }

}
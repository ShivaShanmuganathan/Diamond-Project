// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct NiceStorage{
        uint totalUsers;
        mapping (address => bool) registered;
}

library LibNiceStorage{

    

    function diamondStorage() internal pure returns(NiceStorage storage ds){
        assembly {
            ds.slot := 0
        }
    }


}
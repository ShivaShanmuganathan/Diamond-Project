// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct NiceStorage{
        uint totalUsers;
        mapping (address => bool) registered;
        mapping (address => uint) expiryTime;
        mapping (address => uint) points;
}

library LibNiceStorage2{

    

    function diamondStorage() internal pure returns(NiceStorage storage ds){
        assembly {
            ds.slot := 0
        }
    }


}
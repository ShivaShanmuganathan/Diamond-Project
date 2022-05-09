// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libraries/LibSomeStorage2.sol";
import "../libraries/LibNiceStorage2.sol";

import "hardhat/console.sol";

contract Test2Facet {
    NiceStorage internal s;

    function setStartTime() external {

        LibSomeStorage2.SomeStorage storage ls = LibSomeStorage2.diamondStorage();
        
        LibSomeStorage2.StorageInfo storage lss = ls.storingInfo[msg.sender];
        require(lss.startTime == 0, "Not Zero");
        lss.startTime = block.timestamp;
        ls.totalUsers += 1;
        s.totalUsers += 1;
        s.registered[msg.sender] = true;
        ls.registered[msg.sender] = true;
        s.expiryTime[msg.sender] = block.timestamp + 86400;
        console.log("Checkpoint 2 Reached");

    }

    function test2Func2() external {}

    function getStartTime() external view returns(uint, bool, uint, uint){

        LibSomeStorage2.SomeStorage storage ls = LibSomeStorage2.diamondStorage();
        LibSomeStorage2.StorageInfo storage lss = ls.storingInfo[msg.sender];

        return (lss.startTime, ls.registered[msg.sender], ls.totalUsers, s.expiryTime[msg.sender]);

    }

    function test2Func4() external {}

    function test2Func5() external {}

    function test2Func6() external {}

    function test2Func7() external {}

    function test2Func8() external {}

    function test2Func9() external {}

    function test2Func10() external {}

    function test2Func11() external {}

    function test2Func12() external {}

    function test2Func13() external {}

    function test2Func14() external {}

    function test2Func15() external {}

    function test2Func16() external {}

    function test2Func17() external {}

    function test2Func18() external {}

    function test2Func19() external {}

    function test2Func20() external {}
}

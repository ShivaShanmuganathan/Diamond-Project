// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../libraries/LibSomeStorage.sol";
import "../libraries/LibNiceStorage.sol";

import "hardhat/console.sol";

contract Test1Facet {
    NiceStorage internal s;

    event TestEvent(address something);

    function setStartTime() external {

        LibSomeStorage.SomeStorage storage ls = LibSomeStorage.diamondStorage();
        
        LibSomeStorage.StorageInfo storage lss = ls.storingInfo[msg.sender];
        require(lss.startTime == 0, "Not Zero");
        lss.startTime = block.timestamp;
        s.totalUsers += 1;
        s.registered[msg.sender] = true;
        console.log("Checkpoint Reached");

    }

    function getStartTime() external view returns(uint, bool){

        LibSomeStorage.SomeStorage storage ls = LibSomeStorage.diamondStorage();
        LibSomeStorage.StorageInfo storage lss = ls.storingInfo[msg.sender];

        return (lss.startTime, s.registered[msg.sender]);

    }


    function test1Func2() external {}

    function test1Func3() external {}

    function test1Func4() external {}

    function test1Func5() external {}

    function test1Func6() external {}

    function test1Func7() external {}

    function test1Func8() external {}

    function test1Func9() external {}

    function test1Func10() external {}

    function test1Func11() external {}

    function test1Func12() external {}

    function test1Func13() external {}

    function test1Func14() external {}

    function test1Func15() external {}

    function test1Func16() external {}

    function test1Func17() external {}

    function test1Func18() external {}

    function test1Func19() external {}

    function test1Func20() external {}

    function supportsInterface(bytes4 _interfaceID) external view returns (bool) {}
}

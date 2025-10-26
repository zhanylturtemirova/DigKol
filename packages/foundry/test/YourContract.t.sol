// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/VillageContract.sol";

contract VillageContractTest is Test {
    VillageContract public VillageContract;

    function setUp() public {
        VillageContract = new VillageContract(vm.addr(1));
    }

    function testMessageOnDeployment() public view {
        require(keccak256(bytes(VillageContract.greeting())) == keccak256("Building Unstoppable Apps!!!"));
    }
}

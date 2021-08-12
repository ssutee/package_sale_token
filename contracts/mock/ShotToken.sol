// "SPDX-License-Identifier: UNLICENSED"

pragma solidity 0.6.12;

import "./BasicToken.sol";

contract ShotToken is BasicToken {
    constructor() BasicToken("Shot Token", "SHOT") public {}
}
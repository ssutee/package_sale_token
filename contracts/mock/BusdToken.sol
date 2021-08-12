// "SPDX-License-Identifier: UNLICENSED"

pragma solidity 0.6.12;

import "./BasicToken.sol";

contract BusdToken is BasicToken {
    constructor() BasicToken("Busd Token", "BUSD") public {}
}
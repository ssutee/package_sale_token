// "SPDX-License-Identifier: UNLICENSED"

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PackageSaleToken is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    address public affiliateWallet;

    // tokenA amount => tokenB amount
    mapping(uint256 => uint256) public packages;

    uint256 public constant PERCENT_PRECISION = 1e18; // 1%
    uint256 public referralFee = 2 * PERCENT_PRECISION; // 2%

    IERC20 public tokenA;
    IERC20 public tokenB;

    constructor(
        address _tokenA,
        address _tokenB,
        address _affiliateWallet
    ) public {
        tokenA = IERC20(_tokenA); // BUSD
        tokenB = IERC20(_tokenB); // SHOT

        packages[39e18] = 300e18;
        packages[120e18] = 1000e18;
        packages[225e18] = 2000e18;
        packages[525e18] = 5000e18;
        packages[1000e18] = 10000e18;

        affiliateWallet = _affiliateWallet;
    }

    function balanceOfTokenA() external view returns (uint256) {
        return tokenA.balanceOf(address(this));
    }

    function balanceOfTokenB() external view returns (uint256) {
        return tokenB.balanceOf(address(this));
    }

    function buyNoReferral(uint256 _aAmount) external {
        buy(_aAmount, address(0));
    }

    function buy(uint256 _aAmount, address _referralAddress) public {
        require(msg.sender != _referralAddress, "Self-referral is not allowed");
        require(packages[_aAmount] != 0, "No package");

        uint256 _bAmount = packages[_aAmount];

        tokenA.safeTransferFrom(msg.sender, address(this), _aAmount);
        tokenB.safeTransfer(msg.sender, _bAmount);

        if (_referralAddress != address(0)) {
            uint256 _referralFeeAmount = _bAmount.mul(
                referralFee
            ).div(
                100 * PERCENT_PRECISION
            );
            tokenB.safeTransferFrom(affiliateWallet, _referralAddress, _referralFeeAmount);
        }
    }

    function withdrawTokenA() external onlyOwner {
        uint256 aAmount = tokenA.balanceOf(address(this));
        tokenA.safeTransfer(msg.sender, aAmount);
    }

    function withdrawTokenB() external onlyOwner {
        uint256 bAmount = tokenB.balanceOf(address(this));
        tokenB.safeTransfer(msg.sender, bAmount);
    }

    function addPackage(uint256 _aAmount, uint256 _bAmount) external onlyOwner {
        packages[_aAmount] = _bAmount;
    }

    function removePackage(uint256 _aAmount) external onlyOwner {
        require(packages[_aAmount] != 0, "No package");
        packages[_aAmount] = 0;
    }

    function setReferralFee(uint256 _referralFee) external onlyOwner {
        require(_referralFee != referralFee);
        referralFee = _referralFee;
    }

    function setAffiliateWallet(address _affiliateWallet) external onlyOwner {
        require(_affiliateWallet != address(0));
        require(_affiliateWallet != affiliateWallet);
        affiliateWallet = _affiliateWallet;
    }
}

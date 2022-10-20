// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable;
}

contract Escrow {
    address public nftAddress;
    uint256 public nftID;
    uint256 public purchaseAmount;
    uint256 public escrowAmount;
    address payable public seller;
    address payable public buyer;
    address public inspector;
    address public lender;

    constructor(
        address _nftAddress,
        uint256 _nftID,
        uint256 _purchaseAmount,
        uint256 _escrowAmount,
        address payable _seller,
        address payable _buyer,
        address _inspector,
        address _lender
    ) {
        nftAddress = _nftAddress;
        nftID = _nftID;
        seller = _seller;
        buyer = _buyer;
        purchaseAmount = _purchaseAmount;
        escrowAmount = _escrowAmount;
        inspector = _inspector;
        lender = _lender;
    }

    function finalizeSale() public {
        //Transfer ownership of property
        IERC721(nftAddress).transferFrom(seller, buyer, nftID);
    }
}

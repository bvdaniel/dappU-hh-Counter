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
    address payable public seller;
    address payable public buyer;

    constructor(
        address _nftAddress,
        uint256 _nftID,
        address payable _seller,
        address payable _buyer
    ) {
        nftAddress = _nftAddress;
        nftID = _nftID;
        seller = _seller;
        buyer = _buyer;
    }

    function finalizeSale() public {
        //Transfer ownership of property
        IERC721(nftAddress).transferFrom(seller, buyer, nftID);
    }
}

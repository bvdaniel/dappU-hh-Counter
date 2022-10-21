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

    modifier onlyBuyer() {
        require(msg.sender == buyer, "Only buyer can call this function");
        _;
    }

    modifier onlyInspector() {
        require(
            msg.sender == inspector,
            "Only inspector can call this function"
        );
        _;
    }

    bool public inspectionPassed = false;
    mapping(address => bool) public approval;

    receive() external payable {}

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

    function depositEarnest() public payable onlyBuyer {
        require(msg.value >= escrowAmount);
    }

    function updateInspectionStatus(bool _passed) public onlyInspector {
        inspectionPassed = _passed;
    }

    function approveSale() public {
        approval[seller] = true;
    }

    function approveLender() public {
        approval[lender] = true;
    }

    function approveBuyer() public {
        approval[buyer] = true;
    }

    function finalizeSale() public {
        // Require approval of all implicants
        require(inspectionPassed, "must pass inspection");
        require(approval[buyer], "must by approved by buyer");
        require(approval[seller], "must by approved by seller");
        require(approval[lender], "must be approved by lender");
        require(
            address(this).balance >= purchaseAmount,
            "must have enough ether for sale"
        );

        (bool success, ) = payable(seller).call{value: address(this).balance}(
            ""
        );
        require(success);
        //Transfer ownership of property
        IERC721(nftAddress).transferFrom(seller, buyer, nftID);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "forge-std/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

// Event: Member A bought 10% of greenhouse A
// contract MemberBuySharedAssetContract {
contract VillageContract {
    address public immutable owner;

    constructor(address _owner) {
        owner = _owner;
    }

    // modifier onlyOwner() {
    //     require(msg.sender == owner, "Not the Owner");
    //     _;
    // }
    
    event SharePurchased(
        uint256 indexed assetId,
        address indexed buyer,
        uint256 sharePercentage,
        uint256 totalPrice,
        string assetName
    );

    // basic asset structure
    struct CommunityZone {
        string name;
        uint256 pricePerShare; // price for 1%
        uint256 sharesSold;
        bool active;
    }

    struct Cow {
        string name;
        uint256 pricePerShare; // price for 1%
        uint256 sharesSold;
        bool active;
    }

    mapping(uint256 => Cow) public cows;
    mapping(uint256 => CommunityZone) public communityZones;
    uint256 public nextAssetId = 1;

    // function createGreenhouseA() public onlyOwner {
    function createGreenhouseA() public {
        communityZones[1] = CommunityZone({
            name: "Greenhouse A",
            pricePerShare: 0.01 ether, // 0.01 ETH per 1%
            sharesSold: 10,
            active: true
        });
    }

    function assignCowIntoLivestockFund() public {
        cows[1] = Cow({
            name: "Buryonka the Cow",
            pricePerShare: 0.5 ether, // 0.005 ETH per 1%
            sharesSold: 10,
            active: true
        });
    }

    /////////////////////
    // Check availability and sufficient shares
    /////////////////////
    function getGreenhouseAvailableShares() public view returns (uint256) {
        if (!communityZones[1].active) {
            return 0;
        }
        return 100 - communityZones[1].sharesSold;
    }

    function getCowAvailableShares() public view returns (uint256) {
        if (!cows[1].active) {
            return 0;
        }
        return 100 - cows[1].sharesSold;
    }

    function getGreenhouseInfo() public view returns (
        string memory name,
        uint256 pricePerShare,
        uint256 sharesSold,
        uint256 sharesAvailable,
        bool active
    ) {
        CommunityZone memory cz = communityZones[1];
        return (
            cz.name,
            cz.pricePerShare,
            cz.sharesSold,
            100 - cz.sharesSold,
            cz.active
        );
    }

    function getCowInfo() public view returns (
        string memory name,
        uint256 pricePerShare,
        uint256 sharesSold,
        uint256 sharesAvailable,
        bool active
    ) {
        Cow memory cow = cows[1];
        return (
            cow.name,
            cow.pricePerShare,
            cow.sharesSold,
            100 - cow.sharesSold,
            cow.active
        );
    }



    /////////////////////
    // Purchase
    /////////////////////
    function buyLivestockShares(uint256 _sharePercentage) public payable {
        require(_sharePercentage > 0 && _sharePercentage <= 100, "Invalid percentage");
        require(cows[1].active, "Cow not available");
        require(cows[1].sharesSold + _sharePercentage <= 100, "Not enough shares available");

        cows[1].sharesSold += _sharePercentage;

        emit SharePurchased(2, msg.sender, _sharePercentage, msg.value, "Buryonka the Cow");
    }

    function buyGreenhouseShares(uint256 _sharePercentage) public payable {
        require(_sharePercentage > 0 && _sharePercentage <= 100, "Invalid percentage");
        require(communityZones[1].active, "Greenhouse A not available");
        require(communityZones[1].sharesSold + _sharePercentage <= 100, "Not enough shares available");
        // require(msg.value >= _sharePercentage * communityZones[1].pricePerShare, "Insufficient payment");

        communityZones[1].sharesSold += _sharePercentage;

        emit SharePurchased(1, msg.sender, _sharePercentage, msg.value, "Greenhouse A");
    }
}
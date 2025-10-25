//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "forge-std/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

// Event: Member A bought 10% of greenhouse A
// contract MemberBuySharedAssetContract {
contract YourContract {
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













/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
// contract YourContract {
//     // State Variables
//     address public delegate = 0x317732Eaa6D3d9Bc886c7837AfD9A125E342A50b;
//     function setDelegate(address _delegate) public isOwner {
//         delegate = _delegate;
//     }
//     address public immutable owner;
//     string public greeting = "Building Unstoppable Apps!!!";
//     bool public premium = false;
//     uint256 public totalCounter = 0;
//     mapping(address => uint256) public userGreetingCounter;

//     // Events: a way to emit log statements from smart contract that can be listened to by external parties
//     event GreetingChange(address indexed greetingSetter, string newGreeting, bool premium, uint256 value);

//     // Constructor: Called once on contract deployment
//     // Check packages/foundry/deploy/Deploy.s.sol
//     constructor(address _owner) {
//         owner = _owner;
//     }

//     // Modifier: used to define a set of rules that must be met before or after a function is executed
//     // Check the withdraw() function
//     modifier isOwner() {
//         // msg.sender: predefined variable that represents address of the account that called the current function
//         require(msg.sender == owner, "Not the Owner");
//         _;
//     }

//     /**
//      * Function that allows anyone to change the state variable "greeting" of the contract and increase the counters
//      *
//      * @param _newGreeting (string memory) - new greeting to save on the contract
//      */
//     function setGreeting(string memory _newGreeting) public payable {
//         // Print data to the anvil chain console. Remove when deploying to a live network.

//         console.logString("Setting new greeting");
//         console.logString(_newGreeting);

//         greeting = _newGreeting;
//         totalCounter += 1;
//         userGreetingCounter[msg.sender] += 1;

//         // msg.value: built-in global variable that represents the amount of ether sent with the transaction
//         if (msg.value > 0) {
//             premium = true;
//         } else {
//             premium = false;
//         }

//         // emit: keyword used to trigger an event
//         emit GreetingChange(msg.sender, _newGreeting, msg.value > 0, msg.value);
//     }

//     /**
//      * Function that allows the owner to withdraw all the Ether in the contract
//      * The function can only be called by the owner of the contract as defined by the isOwner modifier
//      */
//     function withdraw() public isOwner {
//         (bool success,) = owner.call{ value: address(this).balance }("");
//         require(success, "Failed to send Ether");
//     }

//     /**
//      * Function that allows the contract to receive ETH
//      */
//     receive() external payable { }
// }

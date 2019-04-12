
pragma solidity >=0.4.22 <0.6.0;

import "./EBookToken.sol";

contract Marketplace {

  mapping(string => Listing[]) private listings;

  struct Listing {
    EBookToken tokenContract;
    uint256 bookPrice;
    uint256 numCopies;
    address payable owner;
  }

  function sell(EBookToken _tokenContract, uint256 _bookPrice, uint256 _numCopies) public {
    require(_tokenContract.balanceOf(msg.sender) >= _numCopies);


    Listing memory l = Listing(_tokenContract, _bookPrice, _numCopies, msg.sender);

    listings[_tokenContract.title()].push(l);

  }

  function buy(string memory _title, uint _listingId, uint256 _numToBuy) public payable {
    require(listings[_title].length > _listingId);

    Listing storage l = listings[_title][_listingId];
    require(l.numCopies >= _numToBuy);
    require(l.numCopies * l.bookPrice >= msg.value);

    // transfers the tokens
    require(l.tokenContract.transferFrom(l.owner, msg.sender, _numToBuy));
    l.numCopies -= _numToBuy;

    l.owner.transfer(l.numCopies * l.bookPrice);
    msg.sender.transfer(msg.value - l.numCopies * l.bookPrice);


  }



}


pragma solidity >=0.4.22 <0.6.0;

import "EBookToken.sol";

contract Marketplace {

  // mapping(string => EBookToken) public eBookToContract;
  mapping(string => Listing[]) public listings;

  struct Listing {
    EBookToken tokenContract;
    uint256 bookPrice;
    uint256 numCopies;
    address payable owner;
  }

  function sell(EBookToken _tokenContract, uint256 _bookPrice, uint256 _numCopies) public {
    require(_tokenContract.balanceOf(msg.sender) >= _numCopies);

    // eBookToContract[_tokenContract.title()] = _tokenContract;

    Listing storage l = Listing(_tokenContract, _bookPrice, _numCopies, msg.sender);

    listings[_tokenContract.name()].push(l);


  }

  function buy(string _title, uint _listingId, uint256 _numToBuy) public payable {
    require(listings[_title] != null);
    require(listings[_title].length > _listingId);

    Listing storage l = listings[_title][_listingId];
    require(l.numCopies >= _numToBuy);
    require(l.numCopies * bookPrice >= msg.value);

    // transfers the tokens
    require(transferFrom(l.owner, msg.sender, _numToBuy));
    l.numCopies -= _numToBuy;

    


  }



}

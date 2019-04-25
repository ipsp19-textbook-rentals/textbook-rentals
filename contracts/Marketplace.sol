
pragma solidity >=0.4.22 <0.6.0;

import "./EBookToken.sol";

contract Marketplace {

  mapping(uint256 => Listing[]) public listings;
  mapping(uint256 => uint256) public numListings;
  uint256 numBooks;

  struct Listing {
    EBookToken tokenContract;
    uint256 bookPrice;
    uint256 numCopies;
    address payable owner;
  }

  function sell(EBookToken _tokenContract, uint256 _bookPrice, uint256 _numCopies) public {
    require(_tokenContract.balanceOf(msg.sender) >= _numCopies);

    Listing memory l = Listing(_tokenContract, _bookPrice, _numCopies, msg.sender);

    listings[_tokenContract.bookId()].push(l);
    numListings[_tokenContract.bookId()]++;

  }

  function buy(uint256 _bookId, uint _listingId, uint256 _numToBuy) public payable {
    require(listings[_bookId].length > _listingId);

    Listing storage l = listings[_bookId][_listingId];
    require(l.numCopies >= _numToBuy);
    require(l.numCopies * l.bookPrice >= msg.value);

    // transfers the tokens
    require(l.tokenContract.transferFrom(l.owner, msg.sender, _numToBuy));
    l.numCopies -= _numToBuy;

    l.owner.transfer(l.numCopies * l.bookPrice * (1 - l.tokenContract.taxRate() / 100));
    l.tokenContract.publisher().transfer(l.numCopies * l.bookPrice * l.tokenContract.taxRate() / 100);
    msg.sender.transfer(msg.value - l.numCopies * l.bookPrice);

  }

  function publish(string memory _title, uint256 _totalSupply, uint256 _taxRate) public returns (EBookToken b) {
    EBookToken book = new EBookToken(_title, numBooks, _totalSupply, _taxRate);
    numBooks++;
    return book;
  }



}

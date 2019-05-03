
pragma solidity >=0.4.22 <0.6.0;

import "./EBookToken.sol";

contract Marketplace {

  mapping(uint256 => Listing[]) public listings;
  mapping(uint256 => uint256) public numListings;

  uint256 public numBooks;

  struct Listing {
    string title;
    EBookToken tokenContract;
    uint256 bookPrice;
    uint256 numCopies;
    address payable owner;
    uint256 bookId;
    uint256 listingId;
    bool sold;
  }

  event Buy(
    string _title,
    uint256 _bookPrice,
    uint256 _numCopies
  );

  event PublishAndSell(
    string _title,
    uint256 _totalSupply,
    uint256 _bookPrice
  );


  function balanceOf(uint256 _bookId) public view returns (uint256) {
    //require(listings[_bookId].length > 0);
    Listing memory l = listings[_bookId][0];
    return l.tokenContract.balanceOf(tx.origin);
  }


  function sell(EBookToken _tokenContract, uint256 _bookPrice, uint256 _numCopies) public {
    require(_tokenContract.balanceOf(tx.origin) >= _numCopies);

    Listing memory l = Listing(_tokenContract.title(), _tokenContract, _bookPrice, _numCopies, tx.origin, _tokenContract.bookId(), numListings[_tokenContract.bookId()], false);


    listings[_tokenContract.bookId()].push(l);
    numListings[_tokenContract.bookId()]++;

  }

  function buy(uint256 _bookId, uint _listingId, uint256 _numToBuy) public payable {
    require(listings[_bookId].length > _listingId);

    Listing storage l = listings[_bookId][_listingId];
    require(l.numCopies >= _numToBuy);
    require(_numToBuy * l.bookPrice <= msg.value);

    // transfers the tokens
    require(l.tokenContract.transferFrom(l.owner, msg.sender, _numToBuy));
    l.numCopies -= _numToBuy;

    if(l.numCopies == 0) {
      l.sold = true;
    }

    l.owner.transfer(_numToBuy * l.bookPrice * (100 - l.tokenContract.taxRate()) / 100);
    l.tokenContract.publisher().transfer(_numToBuy * l.bookPrice * l.tokenContract.taxRate() / 100);
    msg.sender.transfer(msg.value - _numToBuy * l.bookPrice);

    emit Buy(l.title, l.bookPrice, _numToBuy);

  }

  function publish(string memory _title, uint256 _totalSupply, uint256 _taxRate) public returns (EBookToken b) {
    EBookToken book = new EBookToken(_title, numBooks, _totalSupply, _taxRate);
    numBooks++;
    return book;
  }

  function publishAndSell(string memory _title, uint256 _totalSupply, uint256 _taxRate, uint256 _bookPrice) public {

      EBookToken e = publish(_title, _totalSupply, _taxRate);

      sell(e, _bookPrice, _totalSupply);

      emit PublishAndSell(_title, _totalSupply, _bookPrice);

  }



}

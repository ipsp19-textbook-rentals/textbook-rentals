
pragma solidity >=0.4.22 <0.6.0;

import "EBookToken.sol";

contract Marketplace {

  mapping(EBookToken => Listing[]) public listings;

  struct Listing {
    EBookToken tokenContract;
    uint256 bookPrice;
    uint256 numCopies;
    address payable owner;
  }

  function sell(EBookToken _tokenContract, uint256 _bookPrice, uint256 _numCopies) {
    require(_tokenContract.balanceOf(msg.sender) >= _numCopies);

    Listing storage l = Listing(_tokenContract, _bookPrice, _numCopies, msg.sender);

    listings[_tokenContract].push(l);


  }

  function buy() {

  }



}

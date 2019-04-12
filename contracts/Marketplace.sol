
pragma solidity >=0.4.22 <0.6.0;

import "EBookToken.sol";

contract Marketplace {

  mapping(EBookToken => mapping(uint => Listing)) public listings;

  struct Listing {
    EBookToken _tokenContract;
    uint256 bookPrice;
    uint256 numCopies;
  }

  function sell(EBookToken _tokenContract, uint256 _bookPrice, uint256 _numCopies) {
    require(_tokenContract.balanceOf(msg.sender) >= _numCopies);
    



  }

  function buy() {

  }



}

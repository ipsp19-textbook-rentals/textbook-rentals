
pragma solidity >=0.4.22 <0.6.0;

contract EBookToken {

  string public title;
  uint256 public totalSupply;
  uint256 public taxRate;

  event Transfer(
    address _from,
    address _to,
    uint256 _value
  );

  mapping(address => uint256) public balanceOf;

  constructor(string _title, uint256 _totalSupply, uint256 _taxRate) {
    title = _title;
    totalSupply = _totalSupply;
    taxRate = _taxRate;
  }

  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
    require(balanceOf[_from] >= _value);

    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;


    emit Transfer(_from, _to, _value);

    return true;
  }


  function viewEbook() public view {

  }








}

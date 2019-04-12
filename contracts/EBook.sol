
pragma solidity >=0.4.22 <0.6.0;

contract EBook {

  string public name;
  string public totalSupply;

  event Transfer(
    address _from,
    address _to,
    uint256 _value
  );

  mapping(address => uint256) public balanceOf;

  constructor(string _name, uint256 _totalSupply) {
    name = _name;
    totalSupply = _totalSupply;
  }

  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
    require(balanceOf[_from] >= _value);

    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;

    allowance[_from][msg.sender] -= _value;


    emit Transfer(_from, _to, _value);

    return true;
  }


  function viewEbook() public view {

  }








}

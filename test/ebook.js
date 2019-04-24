var EBookToken = artifacts.require("./EBookToken.sol");

contract("EBookToken", function(accounts) {

  it("initialize", async function() {
    const token = await EBookToken.new("title", 10, 10);
    return token.transferFrom.call("0x9A25Bac80D5c1e8cA82a614574f70cF2Bba279A4",
    "0x6071E9fD846140126D5A24b63C7255A29eaBBb15", 1).then(function(result) {
          assert.equal(result, true);
        });
  });
});

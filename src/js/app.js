


App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Marketplace.json", function(marketplace) {
      App.contracts.Marketplace = TruffleContract(marketplace);
      App.contracts.Marketplace.setProvider(App.web3Provider);
      return App.render();
    });
  },

  render: function() {
    var marketplace;

    console.log('llll');

    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    App.contracts.Marketplace.deployed().then(function(instance) {
      marketplaceInstance = instance;
      return marketPlaceInstance.listings(0);
    }).then(function(firstListings) {
      return firstListings.length;
    }).then(function(listingsCount) {
      var listingResults = $("listings");
      listingResults.empty();

      for (var i = 0; i < listingsCount; i++) {
        firstListings(i).then(function(listing){
          var bookPrice = listing[1];
          var numCopies = listing[2];
          var owner = listing[3];

          var listingTemplate = "<div class='book-item'>" + bookPrice + "</div>"
          + "<div class='book-item'>" + numCopies + "</div>"  +
          + "<div class='book-item'>" + owner + "</div>"
          listingResults.append(listingTemplate);
        });
      }
    });
  },

  publishAndSell: function() {
    var title = $('#title').val();
    var price = $('#price').val();
    var numCopies = $('#num-copies').val();
    App.contracts.Marketplace.deployed().then(function(instance) {
      return instance.publish(title, num_copies, 0);
    }).then(function(tokenContract) {
      instance.sell(tokenContract, price, numCopies);
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

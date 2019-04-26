


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

    console.log('a');

    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });


    App.contracts.Marketplace.deployed().then(function(instance) {
      marketplaceInstance = instance;
      console.log('b');

      return marketplaceInstance.numListings(0);
      //errors here
    }).then(function(listingsCount) {

      console.log('c');
      var listingResults = $("listings");


      listingResults.empty();

      for (var i = 0; i < listingsCount.toNumber(); i++) {
        marketplaceInstance.Listings(0, i).then(function(listing){

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
  /*
  render: function() {
    var marketplaceInstance;
    var l;



    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    console.log('abc');
    //errors here
    App.contracts.Marketplace.deployed().then(function(instance) {
      marketplaceInstance = instance;
      console.log(marketplaceInstance.numListin(0));

      return marketplaceInstance.numListin(0);

    }).then(function(listingsCount) {
      console.log(listingsCount);
      var listingResults = $("listings");

      listingResults.empty();

      for (var i = 0; i < listingsCount.toNumber(); i++) {
        marketplaceInstance.Listings(0, i).then(function(listing){

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
  */



  publishAndSell: function() {
    var title = $('#title').val();
    var price = $('#price').val();
    var numCopies = $('#num-copies').val();
    App.contracts.Marketplace.deployed().then(function(instance) {
      marketplaceInstance = instance;
      return marketplaceInstance.publish(title, numCopies, 0);
    }).then(function(tokenContract) {
      marketplaceInstance.sell(tokenContract, price, numCopies);
      App.render();
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

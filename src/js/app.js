


App = {
  web3Provider: null,
  contracts: {},
  marketplaceInstance: null,

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
      App.contracts.Marketplace.deployed().then(function(instance) {

        App.marketplaceInstance = instance;
        return App.render();
      });

    });
  },

  render: function() {
    //var marketplaceInstance;



    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    /*
    App.contracts.Marketplace.deployed().then(function(instance) {
      App.marketplaceInstance = instance;
      console.log('b');

      return App.marketplaceInstance.numListings(0);
      //errors here

    }).*/


    var listingsCount;
    App.marketplaceInstance.numListings(0).then(function(lc) {
      listingsCount = lc;
      return App.marketplaceInstance.numBooks();
    }).then(function(numBooks){


      var listingResults = $("#books");
      listingResults.empty();

      for (var j = 0; j < numBooks.toNumber(); j++) {
        for (var i = 0; i < listingsCount.toNumber(); i++) {

          App.marketplaceInstance.listings(j, i).then(function(listing){

            var sold = listing[7];

            if (sold == false) {
              var title = listing[0];


              var bookPrice = listing[2];
              var owner = listing[4];

              var bookId = listing[5];
              var listingId = listing[6];

              //console.log(listingsCount.toNumber());

              var listingTemplate = "<div class='book-item'>" + title + "</div>";

              listingResults.append(listingTemplate);
              App.addButton(bookId, listingId);
              console.log(listingResults);
            }
          });
        }
      }



    });
  },


  publishAndSell: function() {
    //var marketplaceInstance;
    var title = $('#title').val();
    var price = $('#price').val();
    var numCopies = $('#num-copies').val();

    /*
    App.contracts.Marketplace.deployed().then(function(instance) {
      console.log('here2');
      App.marketplaceInstance = instance;
      App.marketplaceInstance.publishAndSell(".", 10, 10, 10);
      App.render();
    });
    */
    App.marketplaceInstance.publishAndSell(title, 1, 10, price);
    App.render();
  },

  addButton: function(bookId, listingId) {
    var books = document.getElementsByClassName("book-item");
    // for (var i = 0; i < books.length; i++) {
    books[books.length - 1].innerHTML += "<br><button class='btn btn-primary' onclick='App.buy(\"" + bookId + "\",\"" + listingId + "\", 1)'>Buy</button>";

  },

  buy: function(bookId, listingId, numToBuy) {
    console.log(bookId);
    console.log(listingId);
    console.log(numToBuy);
    App.marketplaceInstance.buy(bookId, listingId, numToBuy, {value: 1000000000000000000});   //
  }



};



$(function() {
  $(window).load(function() {
    App.init();
  });
});

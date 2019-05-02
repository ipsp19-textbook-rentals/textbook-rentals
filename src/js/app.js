


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

      var libraryResults = $("#library"); ////
      libraryResults.empty(); //////

      for (var j = 0; j < numBooks.toNumber(); j++) {
        for (var i = 0; i < listingsCount.toNumber(); i++) {

          var balance;
          balance = await App.marketplaceInstance.balanceOf(j);
          App.marketplaceInstance.listings(j, i).then(function(listing){

            var sold = listing[7];

            if (sold == false) {
              var title = listing[0];

              var bookPrice = listing[2];
              var numCopies = listing[3];
              var owner = listing[4];

              var bookId = listing[5];
              var listingId = listing[6];


              var listingTemplate = "<div class='book-item'>" + title + "</div>";

              listingResults.append(listingTemplate);

              /*
              var balance;
              App.marketplaceInstance.balanceOf(j).then(function(b){
                balance = b;
                return App.marketplaceInstance.listings(j, i);
              })
              */

              if (i == 1) {
                libraryResults.append(listingTemplate);
              }


              App.addButton(bookId, listingId);

            }
          });
        }
      }

      //console.log("a");
      //listing the books that YOU own
      /*
      var libraryResults = $("#library");
      var listing;
      libraryResults.empty();
      for (var j = 0; j < numBooks.toNumber(); j++) {

        App.marketplaceInstance.listings(j, 0).then(function(l){
          listing = l;

          return App.marketplaceInstance.balanceOf(App.account);
        }).then(function(numBooks){
          console.log(numBooks);
          if (numBooks.toNumber() > 0) {
            var title = listing[0];
            var libraryTemplate = "<div class='book-item'>" + title + "</div>";

            libraryResults.append(libraryTemplate);
          }
        });

      }
      */




    });
  },


  publishAndSell: function() {
    //var marketplaceInstance;
    var title = $('#title').val();
    var price = $('#price').val();
    var numCopies = $('#num-copies').val();

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

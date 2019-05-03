


App = {
  web3Provider: null,
  contracts: {},
  marketplaceInstance: null,
  count: 0,

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
        //App.listenForEvents();
        return App.render();
      });

    });
  },

/*
  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.publishAndSell({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
  },
  */



  render: function() {

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
    App.count = 0;

    App.marketplaceInstance.numListings(0).then(function(lc) {
      listingsCount = lc;
      console.log(listingsCount.toNumber());
      return App.marketplaceInstance.numBooks();
    }).then(function(numBooks){

      var listingResults = $("#books");

      listingResults.empty();

      for (var j = 0; j < numBooks.toNumber(); j++) {
        for (var i = 0; i < listingsCount.toNumber(); i++) {
          App.marketplaceInstance.listings(j, i).then(function(listing){
             console.log(listing[0]);
             console.log(listing[5].toNumber());
             console.log(listing[6].toNumber());
             console.log(listing[2].toNumber());
             console.log(listing[8]);
            var sold = listing[7];

            if (sold == false) {
              var title = listing[0];

              var bookPrice = listing[2];
              var numCopies = listing[3];
              var owner = listing[4];

              var bookId = listing[5];
              var listingId = listing[6];

              var listingTemplate = "<div class='book-item'>" + title + "<br><div class='copy'>Price: $" + bookPrice + "</div><div class='copy'>Copies remaining: " + numCopies + "</div></div>";


              listingResults.append(listingTemplate);


              // var balance;
              // App.marketplaceInstance.balanceOf(j).then(function(b){
              //   balance = b;
              //   return App.marketplaceInstance.listings(j, i);
              // })


              App.addButton(bookId, listingId);

            }
          });
        }
      }

      //console.log("a");
      //listing the books that YOU own




    });
    App.marketplaceInstance.numListings(0).then(function(lc) {
      listingsCount = lc;
      return App.marketplaceInstance.numBooks();
    }).then(function(numBooks) {
    var libraryResults = $("#library");
    var listing;
    var publisher;
    libraryResults.empty();
    if (numBooks.toNumber() == 0) {
      libraryEmpty();
    }
    for (var j = 0; j < numBooks.toNumber(); j++) {
      var i = 0;
      //for(var i = 0; i < listingsCount.toNumber(); i++) {
        App.createLibrary(j, i, numBooks, libraryResults);
      //}
    }
    //for (var j = 0; j < numBooks.toNumber(); j++) {

      // App.marketplaceInstance.listings(j, 0).then(function(l){
      //   listing = l;
      //   return })
      //start App.marketplaceInstance.listings(j, 0).then(function(l){
      //   listing=l;
      // App.marketplaceInstance.balanceOf(j).then(function(numBook){
      //   App.marketplaceInstance.getPublisher(listing[1]).then(function(p){
      //     publisher = p;
      //     console.log("working");
      //     if (numBook.toNumber() > 0 && publisher != App.account && !listing[8]) {
      //       var title = listing[0];
      //       var libraryTemplate = "<div class='book-item-library'>" + title + "</div>";
      //
      //       libraryResults.append(libraryTemplate);
      //       App.addLibraryButton(listing[5], listing[6]);
      //     } else {
      //       count +=1;
      //     }
      //   }).then(function() {
      //     if(count == numBooks.toNumber()){libraryEmpty()}});
      //end   });});
    //}
    });
  },

  createLibrary: function(j, i, numBooks, libraryResults) {
    var listing;
    App.marketplaceInstance.listings(j, i).then(function(l){
      listing=l;
    App.marketplaceInstance.balanceOf(j).then(function(numBook){
      App.marketplaceInstance.getPublisher(listing[1]).then(function(publisher){
        //console.log(numBook.toNumber());
        if (numBook.toNumber() > 0 && publisher != App.account && !listing[8]) {
          var title = listing[0];
          var libraryTemplate = "<div class='book-item-library'>" + title + "</div>";

          libraryResults.append(libraryTemplate);
          App.addLibraryButton(listing[5], listing[6]);
        } else {
          App.count +=1;
        }
      }).then(function() {
        if(App.count == numBooks.toNumber()){libraryEmpty()}});
      });
    });
  },


  publishAndSell: function() {
    //var marketplaceInstance;
    var title = $('#title').val();
    var price = $('#price').val();
    var numCopies = $('#num-copies').val();

    App.marketplaceInstance.publishAndSell(title, numCopies, 10, price);
    App.render();
  },

  addButton: function(bookId, listingId) {
    var books = document.getElementsByClassName("book-item");
    books[books.length - 1].innerHTML += "<br><button class='btn btn-primary' onclick='App.buy(\"" + bookId + "\",\"" + listingId + "\", 1)'>Buy</button>";
  },

  addLibraryButton: function(bookId, listingId) {
    var books = document.getElementsByClassName("book-item-library");
    books[books.length - 1].innerHTML += "<br><button class='btn btn-primary'>Read</button>";
    books[books.length - 1].innerHTML += "<br><button class='btn btn-primary' onclick='resell(\"" + bookId + "\",\"" + listingId + "\")'>Resell</button>";
  },

  buy: function(bookId, listingId, numToBuy) {
    console.log(bookId);
    console.log(listingId);
    console.log(numToBuy);
    App.marketplaceInstance.buy(bookId, listingId, numToBuy, {value: 1000000000000000000});
    App.marketplaceInstance.updateResold(bookId, 0, false);
  },

  resell: function(bookId, listingId) {
    var price = $('#resale-price').val();
    App.marketplaceInstance.listings(bookId, listingId).then(function(listing) {
      App.marketplaceInstance.sell(listing[1], price, 1).then(function() {
        console.log("bookId " + bookId);
        console.log("listingId " + listingId);
        App.marketplaceInstance.updateResold(bookId, 0, true);
        //App.marketplaceInstance.numListings(bookId).then(function(num){
          //App.marketplaceInstance.updateResold(bookId, num + 1, true);
        //});
      });
    });
  }



};



$(function() {
  $(window).load(function() {
    App.init();
  });
});

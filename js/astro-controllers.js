(function () {
  "use strict";

  angular.module('app.astro-controllers', [])
  .controller('AstroCatalogueTodosCtrl', AstroCatalogueTodosCtrl)
  .controller('AstroCatPresenterCtrl', AstroCatPresenterCtrl)
  .controller('AstroCatalogueObjectCtrl', AstroCatalogueObjectCtrl)
  .controller('AstroCatalogueFavoriteCtrl', AstroCatalogueFavoriteCtrl);
  //  .controller('ModalObjectCtrl', ModalObjectCtrl);

  function pad (str, max) {
    var spaces = '0'.repeat(max);
    var xtmp = spaces.substr(0,spaces.length-str.length);
    var xtmp = xtmp+str;
    return xtmp;
  }

  function padSpace (str, max) {
    var spaces = ' '.repeat(max);
    var xtmp = spaces.substr(0,spaces.length-str.length);
    var xtmp = xtmp+str;
    return xtmp;
  }

  function trimAllSpace (str) {
    var xtmp = str.trim();
    xtmp = xtmp.replace(' ','');
    return xtmp;
  }


  AstroCatPresenterCtrl.$inject = ['$scope'];
  function AstroCatPresenterCtrl($scope) {

  }

  AstroCatalogueTodosCtrl.$inject = ['$scope',  '$rootScope', 'ObjFactory', '$state','$ionicPopup','$ionicPopover'];
  function AstroCatalogueTodosCtrl($scope,  $rootScope, ObjFactory, $state, $ionicPopup, $ionicPopover) {
    var itemobjs = this;
    $scope.objFilter = [];
    $scope.objFilterNoFilter = [];
    $scope.searchTerm = "";
    $scope.mySelect = $rootScope.myCat;
    $scope.cat = $rootScope.cat;
    $scope.filters = [];
    $scope.selFilters = $rootScope.myFilter;

    itemobjs.initAll = function(){
      var promise = ObjFactory.initAll();
      promise.then(function (objs) {
        $scope.cat = $rootScope.cat;
      })
    }

    itemobjs.getFilters = function (cats) {
      console.log("Recupera Filtros!");
      var it = 0;
      var flt = '{ "TYPES": [{"name": "No Filter", "abrev": "No Filter"}';
      //filters.push("No Filter");
      for(it = 0; it < cats.length; it++ ){
        var id = 0;
        if(it == 0){
          flt = flt + ',{"name": "' + cats[it].OBJECT.TYPE_DESCR +'", "abrev": "'+ cats[it].OBJECT.TYPE + '"}' ;
        }else{
          if(flt.indexOf(cats[it].OBJECT.TYPE) == -1){
            flt = flt + ',{"name": "' + cats[it].OBJECT.TYPE_DESCR +'", "abrev": "'+ cats[it].OBJECT.TYPE + '"}' ;
          }
        }
      }
      flt = flt + ']}';
      $ionicPopover.fromTemplateUrl('filter-popover.html', {
        scope: $scope
      }).then(function(popover) {
        console.log("Aqui Popover 2!");
        $scope.popoverFilter = popover;
      });
      return JSON.parse(flt);
    }

    // $scope.getCat = function(){
    //   $scope.cat = $rootScope.cat;
    //   $state.go('app.profile');
    // }

    var cat = function(){
      console.log("Passei Cat");
      var cat = [];
      for(item in $rootScope.cat){
        cat.push("{name : \"" + item + "\"},");
      }
      $scope.cat =  cat;
    }

    itemobjs.getCat = function (myFilter) {
      var promise = ObjFactory.get($rootScope.myCat, myFilter);
      promise.then(function (objs) {
        var cata = JSON.parse(objs[0]);
        $scope.objFilter = cata.cats;
      })

    }

    itemobjs.getObjs = function (mySelect) {
      var promise = ObjFactory.get(mySelect, null);
      promise.then(function (objs) {
        $rootScope.myCat = mySelect;
        var cata = JSON.parse(objs[0]);
        $scope.filters = itemobjs.getFilters(cata.cats).TYPES;
        $scope.objFilter = cata.cats;
      })
    }

    //if(!angular.isUndefined($rootScope.myFilter)){
    //  itemobjs.getObjs($rootScope.myFilter);
    //}else
    if (!angular.isUndefined($rootScope.myCat)){
      itemobjs.getObjs($rootScope.myCat);
      if(!angular.isUndefined($rootScope.myFilter)){
        itemobjs.getCat($rootScope.myFilter);
      }
      if (angular.isUndefined($rootScope.cat)){
        var scope = $rootScope.$new();
        scope.$on('dbInitialized', function() {
          itemobjs.initAll();
        });
      }
    }

    $scope.setSelectfilter = function(myFilter) {
      $scope.popoverFilter.hide();
      $scope.selFilters = myFilter;
      $rootScope.myFilter = myFilter;
      if(myFilter.indexOf("No Filter") == -1){
        itemobjs.getCat(myFilter);
      }else{
        itemobjs.getObjs($rootScope.myCat);
      }
    }

    $scope.showSelectValue = function(mySelect) {
      $scope.popover.hide();
      $scope.mySelect = mySelect;
      $rootScope.myCat = mySelect;
      var aCat = mySelect.split("-");
      itemobjs.getObjs(aCat[0].trim(), $scope.selFilters);
    }

    $scope.showObjectStage = function(myObject){
      // handle event
      $rootScope.obj = myObject;
      $state.go('app.activity', {obj: myObject});
    }

    $scope.getSearchTerm = function(searchTerm){
      var promise = ObjFactory.getObj(searchTerm);
      promise.then(function (objs) {
        if(objs != null){
          $scope.currentObj = objs[0].split(",");
          $scope.showObjectStage($scope.currentObj[0]);
        }else{
          $ionicPopup.alert({
            title: "Search Object",
            content: "No results found! Try again.",
            cssClass: 'confirm-popup'
          })
        }
      }, function (err) {
        console.error(err);
      });
    }

    $ionicPopover.fromTemplateUrl('my-popover.html', {
      scope: $scope
    }).then(function(popover) {
      console.log("Aqui Popover !");
      $scope.popover = popover;
    });

    $scope.openPopover = function($event) {
      console.log("Cliquei Popover !")
      $scope.popover.show($event);
    };

    $scope.openPopoverFilter = function($event) {
      console.log("Cliquei Popover !")
      $scope.popoverFilter.show($event);
    };

    $scope.closePopover = function() {
      $scope.popover.hide();
    };

  }

  AstroCatalogueFavoriteCtrl.$inject = ['$scope', '$rootScope', 'ObjFactory', '$state','$ionicPopup' ];
  function AstroCatalogueFavoriteCtrl($scope,  $rootScope, ObjFactory, $state, $ionicPopup) {
    var favObjs = this;

    $scope.favoriteObjs = $rootScope.fav;
    $scope.showObjectStage = function(myObject){
      // handle event
      $rootScope.obj = myObject;
      $state.go('app.activity', {obj: myObject});
    }
    favObjs.removeFavorite = function(myObject){
      console.log("Removendo Favorite!");
      var promise = ObjFactory.removeFav(myObject);
      var index = $rootScope.fav.indexOf(myObject);
      $rootScope.fav.splice(index, 1);
    }

    // Confirm popup code

    $scope.confirmDelete = function(myObject) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Delete favorite '+ myObject,
        template: 'Do you need delete this favorite ?',
        cssClass: 'confirm-popup'
      });
      confirmPopup.then(function(res) {
        if (res) {
          favObjs.removeFavorite(myObject);
        }
      });
    }
  }

  AstroCatalogueObjectCtrl.$inject = ['$scope',  '$rootScope', 'ObjFactory',  '$stateParams', '$ionicPopup','$ionicModal','$timeout','$ImageCacheFactory'];
  function AstroCatalogueObjectCtrl($scope, $rootScope, ObjFactory,  $stateParams, $ionicPopup, $ionicModal, $timeout, $ImageCacheFactory) {
    var obj = this;
    obj.winWidth = window.screen.width;
    obj.winHeight = window.screen.height;
    $scope.msg = "";
    $scope.showLnkChartDss = true;

    $scope.winLeft = obj.winWidth - 190;
    $scope.winCenter = (obj.winWidth/2) - (190/2);
    $scope.winBottom = obj.winHeight - 200;

    $scope.addFavorite = function (myObject) {
      var promise = ObjFactory.addFav(myObject);
      $scope.resu = true;
      for(var ob in $rootScope.fav){
        if($rootScope.fav[ob].indexOf(myObject) > -1){
          $scope.resu = false;
          //        $scope.msg = "Favorite already added!";
          $ionicPopup.alert({
            title: 'Add Favorite',
            template: 'The '+ myObject +' object was already added to favorites ?',
            cssClass: 'confirm-popup'
          });
          break;
        }
      }
      if($scope.resu){
        $rootScope.fav.push(myObject);
        $ionicPopup.alert({
          title: 'Add Favorite',
          template: 'The '+ myObject +' object was added to favorites ?',
          cssClass: 'confirm-popup'
        });
      }
      console.log("Added Favorite 2!"+ myObject);
    }

    obj.getObjDetail = function (myObject) {
      var promise = ObjFactory.getObj(myObject);
      promise.then(function (objs) {
        //  $rootScope.obj = objs;
        //    console.log("Object: " + objs);
        $scope.currentObj = objs[0].split(",");
        var ra = $scope.currentObj[4];
        var dc = $scope.currentObj[5];
        ra = ra.replace(' ','+');
        dc = dc.replace(' ','+');

        //Se outra denominação não for NGC chama remoto senão local
        var urlDSS = "";

        if($scope.currentObj[2].trim().indexOf("CL+NB") > -1 || $scope.currentObj[2].trim().indexOf("GALXY") > -1){
          urlDSS = "http://dss.nao.ac.jp/cgi-bin/getimage.cgi?ra="+ra+"&dec="+dc+"&size=60&mode=transgress&src=dss2&band=bri&type=png";
        }else{
          urlDSS = "http://stdatu.stsci.edu/cgi-bin/dss_search?v=poss2ukstu_red&r="+ra+"&d="+dc+"&e=J2000&h=15.0&w=15.0&f=gif&c=none&fov=NONE&v3=";
        }
        var ht = 0;
        if(($scope.currentObj[10] != '        ') && ($scope.currentObj[10].indexOf("m") > -1)){
          var aDim = $scope.currentObj[10].replace('m','').trim();
          ht = Math.abs(aDim) + 10;
        }
        if(($scope.currentObj[10] != '        ') && ($scope.currentObj[10].indexOf("s") > -1)){
          ht = 10;
        }
        if($scope.currentObj[2].trim().indexOf("QUASR") > -1){
          ht = 10;
        }

        if((ht < 61) && (ht > 0)){
          urlDSS = "http://stdatu.stsci.edu/cgi-bin/dss_search?v=poss2ukstu_red&r="+ra+"&d="+dc+"&e=J2000&h="+ht+"&w="+ht+"&f=gif&c=none&fov=NONE&v3=";
        }else{
          urlDSS = "http://dss.nao.ac.jp/cgi-bin/getimage.cgi?ra="+ra+"&dec="+dc+"&size=120&mode=transgress&src=dss2&band=bri&type=png";
        }
        //console.log("Dim: "+aDim[0]+" -  ht :"+ht+ " - "+ $scope.currentObj[10]);
        //}
        // if(($scope.currentObj[1].indexOf("M  ") > -1 || $scope.currentObj[0].indexOf("M  ") > -1)){
        //   if($scope.currentObj[2].trim().indexOf("PLNNB") > -1 || $scope.currentObj[2].trim().indexOf("SNREM") > -1 || $scope.currentObj[2].trim().indexOf("GLOCL") > -1 || $scope.currentObj[2].trim().indexOf("GALXY") > -1){
        //     urlDSS = "http://stdatu.stsci.edu/cgi-bin/dss_search?v=poss2ukstu_red&r="+ra+"&d="+dc+"&e=J2000&h=15.0&w=15.0&f=gif&c=none&fov=NONE&v3=";
        //   }//else{
        //     //   console.log("120 Aqui !!");
        //     //   urlDSS = "http://dss.nao.ac.jp/cgi-bin/getimage.cgi?ra="+ra+"&dec="+dc+"&size=120&mode=transgress&src=dss2&band=bri&type=png";
        //     // }
        //   }
        // M 31 exception
        if($scope.currentObj[1].indexOf("M  31") > -1 || $scope.currentObj[0].indexOf("M  31") > -1 || $scope.currentObj[1].indexOf("M  45") > -1 || $scope.currentObj[0].indexOf("M  45") > -1 ){
          //console.log("120 Aqui !!");
          urlDSS = "http://dss.nao.ac.jp/cgi-bin/getimage.cgi?ra="+ra+"&dec="+dc+"&size=120&mode=transgress&src=dss2&band=bri&type=png";
        }

        // IMGS NGC?IC PRJECT NEED AUTORIZATION
        // if(($scope.currentObj[1].indexOf("NGC") > -1 || $scope.currentObj[0].indexOf("NGC") > -1)){
        //   var atmp = "";
        //   if($scope.currentObj[0].indexOf("NGC") > -1){
        //     atmp = $scope.currentObj[0].replace('NGC','').trim();
        //   }else{
        //     atmp = $scope.currentObj[1].replace('NGC','').trim();
        //   }
        //   atmp = pad(atmp,4);
        //   urlDSS = "http://www.ngcicproject.org/dss/n/"+atmp.charAt(0)+"/n"+atmp+".jpg";
        // }

        if(!$rootScope.internet) {
          //console.log("Chequei internet!");
          urlDSS = "img/mobi_NGC/branco.jpg";
          $ionicPopup.alert({
            title: "Internet Disconnected",
            content: "The internet is disconnected on your device. Some images may not be displayed. ",
            cssClass: 'confirm-popup'
          })
        }
        //console.log(urlDSS);
        //    $scope.urlDSS = urlDSS;
        // var listMyImg = []
        // listMyImg.push(urlDSS);
        // $scope.urlDSS =   $ImageCacheFactory.Cache(listMyImg);
        $scope.showLnkChartDss = true;
        $scope.urlDSS =   urlDSS;
      })
    }

    $scope.obj = obj.getObjDetail($rootScope.obj);

    $scope.ShowImg = function (){
      obj.getObjDetail($rootScope.obj);
    }

    $scope.showChart = function () {
      //$scope.currentObj = objs[0].split(",");
      var ra = $scope.currentObj[4];
      var dc = $scope.currentObj[5];
      var hm = "North";
      var mgl = Math.abs($scope.currentObj[6])+2;
      var mg = Math.abs($scope.currentObj[6]);
      ra = ra.replace(' ','+');
      dc = dc.replace(' ','+');

      // if(mg > 8){
      //
      //   mg = 12;
      //
      // }
      console.log("Magnitude: "+mg);
      if(dc.indexOf("-") > -1){
        dc = dc.replace('-','');
        hm = "South";
      }
      var pUrl = "https://www.fourmilab.ch/cgi-bin/Yourtel?date=0&utc=1998%2F02%2F14+20%3A55%3A01&jd=2450859.37154&lon="+ra+"&lat="+dc+"&ns="+hm;

      pUrl = pUrl + "&fov=25%BA&deep=on&deepm="+mg+"&consto=on&constn=on&consts=on&constb=on&limag=8&starn=on&starnm=2.0&starbm=3.0&showm=on&showmb=-1.5&showmd=6.0&imgsize=450&dynimg=y&fontscale=0.7&scheme=1&elements=";

      // "https://www.fourmilab.ch/cgi-bin/Yourtel?date=0&lon=0h&lat=0%B0&ns=North&fov=25%B0&deep=on&deepm=15.0&consto=on&constn=on&constb=on&limag=18&starnm=3.0&starb=on&starbm=5.0&showmb=-1.5&showmd=6&imgsize=450&dynimg=y&fontscale=0.7&scheme=2&elements="
      $scope.dss = 2;
      console.log(pUrl);
      $scope.showLnkChartDss = false;
      $scope.urlDSS = pUrl;

    }

    // $scope.templates = [{ name: 'AstroSACDOC.html', url: 'templates/astroSACDoc.html'},{ name: 'template2.html', url: 'template2.html'}];
    // $scope.template = $scope.templates[0];

    // Modal 1
    $ionicModal.fromTemplateUrl('my-modal.html', {
      id: '1', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      backdropClickToClose: false //,
      //animation: 'zoom-in'
    }).then(function(modal) {
      $scope.oModal1 = modal;
    });

    // Modal 2
    // $ionicModal.fromTemplateUrl('astroSACDoc.html', {
    //   id: '2', // We need to use and ID to identify the modal that is firing the event!
    //   scope: $scope,
    //   backdropClickToClose: false,
    //   animation: 'fadeInBottom'
    // }).then(function(modal) {
    //   $scope.oModal2 = modal;
    // });

    // $ionicModal.fromTemplateUrl('my-popup.html', {
    //   id: '3',
    //   scope: $scope,
    //   backdropClickToClose: false,
    //   animation: 'zoom-in'
    // }).then(function(modal) {
    //   $scope.oModal3 = modal;
    // });

    $scope.openModal = function(index) {
      switch(index) {
        case 1:
        $scope.oModal1.show();
        break;
        // case 2:
        // $scope.oModal2.show();
        // break;
        // case 3:
        // $scope.oModal3.show();
        // $timeout(function () {
        //   $scope.oModal3.hide();
        // }, 4000);
        // break;
      }
    };

    $scope.closeModal = function(index) {
      switch(index) {
        case 1:
        $scope.oModal1.hide();
        break;
        // case 2:
        // $scope.oModal2.hide();
        // break;
        // case 3:
        // $scope.oModal3.hide();
        // break;
      }
    };

    /* Listen for broadcasted messages */

    $scope.$on('modal.shown', function(event, modal) {
      //    console.log('Modal ' + modal.id + ' is shown!');
    });

    $scope.$on('modal.hidden', function(event, modal) {
      //    console.log('Modal ' + modal.id + ' is hidden!');
    });

    // Cleanup the modals when we're done with them (i.e: state change)
    // Angular will broadcast a $destroy event just before tearing down a scope
    // and removing the scope from its parent.
    $scope.$on('$destroy', function() {
      //    console.log('Destroying modals...');
      $scope.oModal1.remove();
      //   $scope.oModal2.remove();
      //  $scope.oModal3.remove();
    });

  }
})();

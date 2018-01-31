// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var db;
var catOk = undefined;

angular.module('app', ['ionic',  'ionic-material', 'ionMdInput', 'ionic.ion.imageCacheFactory',  'app.layout-controllers', 'app.astro-controllers', 'app.routes', 'app.services', 'ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};
  $scope.isExpanded = false;
  $scope.hasHeaderFabLeft = false;
  $scope.hasHeaderFabRight = false;

  var navIcons = document.getElementsByClassName('ion-navicon');
  for (var i = 0; i < navIcons.length; i++) {
    navIcons.addEventListener('click', function() {
      this.classList.toggle('active');
    });
  }

  ////////////////////////////////////////
  // Layout Methods
  ////////////////////////////////////////

  $scope.hideNavBar = function() {
    document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
  };

  $scope.showNavBar = function() {
    document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
  };

  $scope.noHeader = function() {
    var content = document.getElementsByTagName('ion-content');
    for (var i = 0; i < content.length; i++) {
      if (content[i].classList.contains('has-header')) {
        content[i].classList.toggle('has-header');
      }
    }
  };

  $scope.setExpanded = function(bool) {
    $scope.isExpanded = bool;
  };

  $scope.setHeaderFab = function(location) {
    var hasHeaderFabLeft = false;
    var hasHeaderFabRight = false;

    switch (location) {
      case 'left':
      hasHeaderFabLeft = true;
      break;
      case 'right':
      hasHeaderFabRight = true;
      break;
    }

    $scope.hasHeaderFabLeft = hasHeaderFabLeft;
    $scope.hasHeaderFabRight = hasHeaderFabRight;
  };

  $scope.hasHeader = function() {
    var content = document.getElementsByTagName('ion-content');
    for (var i = 0; i < content.length; i++) {
      if (!content[i].classList.contains('has-header')) {
        content[i].classList.toggle('has-header');
      }
    }

  };

  $scope.hideHeader = function() {
    $scope.hideNavBar();
    $scope.noHeader();
  };

  $scope.showHeader = function() {
    $scope.showNavBar();
    $scope.hasHeader();
  };

  $scope.clearFabs = function() {
    var fabs = document.getElementsByClassName('button-fab');
    if (fabs.length && fabs.length > 1) {
      fabs[0].remove();
    }
  };
})

.controller('LoginCtrl', function($scope, $timeout, $stateParams, ionicMaterialInk, $rootScope, $ionicLoading, $http, $cordovaSQLite, $cordovaNetwork, $window, $state) {
  var loginObjs = this;
  $scope.$parent.clearFabs();
  $scope.btLabel = true;
  $rootScope.myCat = undefined;
  $rootScope.myFilter = undefined;

  loginObjs.load = function(){
    if (!angular.isUndefined(catOk)){
      $scope.btLabel = false;
    }
  }

  $timeout(function() {
    $scope.$parent.hideHeader();
  }, 10);

  $scope.ChargeDb = function(){
    if (!angular.isUndefined(catOk)){
      $scope.btLabel = false;
      $state.go('app.profile');
    }
  }

  loginObjs.load();

})

.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
  // Set Header
  $scope.$parent.showHeader();
  $scope.$parent.clearFabs();
  $scope.$parent.setHeaderFab('left');

  // Delay expansion
  $timeout(function() {
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
  }, 300);

  // Set Motion
  ionicMaterialMotion.fadeSlideInRight();

  // Set Ink
  ionicMaterialInk.displayEffect();
})

.controller('InitCtrl', function($scope, $rootScope, $ionicLoading, $http, $cordovaSQLite, $cordovaNetwork, $window) {
  $rootScope.myCat = undefined;
  $rootScope.myFilter = undefined;

  if(angular.isUndefined($rootScope.fav)){
    $rootScope.fav = [];
  }

  if(angular.isUndefined(db)){
    // Setup the loader
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.
    //  $timeout(function () {
    var scope = $rootScope.$new();
    //console.log(scope.$on('dbInitialized'));
    scope.$on('dbInitialized', function() {
      var query = "select distinct substr(A.OBJECT,1,instr(A.OBJECT,' ')) as OBJECT, B.descricao as DESCRICAO from data_object A left join catalogue B on substr(A.OBJECT,1,instr(A.OBJECT,' ')) =   substr(B.sigla,1,instr(B.sigla,' ')) order by OBJECT";

      if(db !== null){
        $cordovaSQLite.execute(db, query).then(function(res) {
          var cat = [];
          console.log("executando SQL..." + res.rows.length);
          if(res.rows.length > 0){
            var totLin= res.rows.length;
            var it = 0;
            for(it = 0; it < totLin; it++) {
              cat.push(res.rows.item(it).OBJECT + " - " + res.rows.item(it).DESCRICAO);
            }
            var response = cat;
            response.data = response;
            $rootScope.cat = response.data;
            catOk = true;
          } else {
            console.log("No results found for Catalog!");
          }
        }, function (err) {
          console.error(err);
        });
        // Carregando favoriteObjs
        query = "Select favObject from favorites order by favObject";
        $cordovaSQLite.execute(db, query).then(function(res) {
          var fav = [];
          if(res.rows.length > 0) {
            var totLin= res.rows.length;
            var it = 0;
            for(it = 0; it < totLin; it++) {
              fav.push(res.rows.item(it).favObject);
            }
            var response = fav
            response.data = response;
            $rootScope.fav = response.data;
          }else {
            console.log("No results found");
          }
          //  console.log("App Load:"+$rootScope.cat);
        }, function (err) {
          console.error(err);
        });
        // Carregando filtros
        query = "Select * from tipo_obj order by abrev";
        $cordovaSQLite.execute(db, query).then(function(res) {
          var filters = [];
          if(res.rows.length > 0) {
            var totLin= res.rows.length;
            var it = 0;
            for(it = 0; it < totLin; it++) {
              filters.push(res.rows.item(it).abrev+"-"+res.rows.item(it).descricao);
            }
            var response = filters
            response.data = response;
            $rootScope.filters = response.data;
            $rootScope.myFilter = "";
          }else {
            console.log("No results found");
          }
          //  console.log("App Load:"+$rootScope.cat);
        }, function (err) {
          console.error(err);
        });
      }



      document.addEventListener("deviceready", function () {
        //    angular.bootstrap(document.body, ['app']);

        $scope.network = $cordovaNetwork.getNetwork();
        $scope.isOnline = $cordovaNetwork.isOnline();
        $scope.$apply();
        $rootScope.internet = true;

        // listen for Online event
        $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
          console.log("got online");
          $scope.isOnline = true;
          $scope.network = $cordovaNetwork.getNetwork();
          $rootScope.internet = true;
          $scope.$apply();
        })

        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
          console.log("got offline");
          $rootScope.$broadcast('noInternet');
          $rootScope.internet = false;
          $scope.isOnline = false;
          $scope.network = $cordovaNetwork.getNetwork();

          $scope.$apply();
        })

      }, false);

      $ionicLoading.hide();

    })
    //  }, 10000);
  }
})


.run(function($ionicPlatform, $cordovaSQLite, $rootScope, $ionicPopup, $cordovaSplashscreen) {
  setTimeout(function() {
    $cordovaSplashscreen.hide()
  }, 1000);
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)if(window.Connection) {

    // Value	Description
    // Connection.UNKNOWN	Unknown connection
    // Connection.ETHERNET	Ethernet connection
    // Connection.WIFI	WiFi connection
    // Connection.CELL_2G	Cell 2G connection
    // Connection.CELL_3G	Cell 3G connection
    // Connection.CELL_4G	Cell 4G connection
    // Connection.NONE	No network connection

    if(window.Connection) {
      $rootScope.internet = true;
      if(navigator.connection.type == Connection.NONE) {
        $rootScope.$broadcast('noInternet');
        $rootScope.internet = false;
        $ionicPopup.confirm({
          title: "Internet Disconnected",
          content: "The internet is disconnected on your device. Do you want continue ?",
          cssClass: 'confirm-popup'
        })
        .then(function(result) {
          if(!result) {
            ionic.Platform.exitApp();
          }
        });
      }
    }

    if (window.cordova) {
      db = $cordovaSQLite.openDB({ name: "SAC_81.db", location: 2, createFromLocation: 1}); //device
    }else{
      //      console.log("browser");
      db = window.sqlitePlugin.openDatabase({ name: "SAC_81.db", location: 2, createFromLocation: 1});// browser
    }
    $rootScope.$broadcast('dbInitialized');

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }


  });
})

.directive('disableSideMenuDrag', ['$ionicSideMenuDelegate', '$rootScope', function($ionicSideMenuDelegate, $rootScope) {
  return {
    restrict: "A",
    controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

      function stopDrag(){
        $ionicSideMenuDelegate.canDragContent(false);
      }

      function allowDrag(){
        $ionicSideMenuDelegate.canDragContent(true);
      }

      $rootScope.$on('$ionicSlides.slideChangeEnd', allowDrag);
      $element.on('touchstart', stopDrag);
      $element.on('touchend', allowDrag);
      $element.on('mousedown', stopDrag);
      $element.on('mouseup', allowDrag);

    }]
  };
}])

.directive('myCurrentLabel', ['$interval',
function($interval) {
  // return the directive link function. (compile function not needed)
  return function(scope, element, attrs) {
    var btLabel,  // date format
    stopTime; // so that we can cancel the time updates

    // used to update the UI
    function updateLabel() {
      if (!angular.isUndefined(catOk)){
        element.text("Press to Start", btLabel);
      }else{
        element.text("Please Wait! Loading Data ....", btLabel);
      }
    }

    // watch the expression, and update the UI on change.
    scope.$watch(attrs.myCurrentLabel, function(value) {
      btLabel = value;
      updateLabel();
    });

    stopTime = $interval(updateLabel, 2000);

    // listen on DOM destroy (removal) event, and cancel the next UI update
    // to prevent updating time after the DOM element was removed.
    element.on('$destroy', function() {
      $interval.cancel(stopTime);
    });
  }
}]);

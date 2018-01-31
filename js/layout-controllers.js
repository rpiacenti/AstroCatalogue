/* global angular, document, window */
'use strict';

angular.module('app.layout-controllers', [])

.controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $state, $ionicPlatform) {
  // Set Header
  $scope.$parent.showHeader();
  $scope.$parent.clearFabs();
  $scope.isExpanded = false;
  $scope.$parent.setExpanded(false);
  $scope.$parent.setHeaderFab(false);

  $scope.rateUs = function () {
    if ($ionicPlatform.is('ios')) {
      //  window.open('itms-apps://itunes.apple.com/us/app/domainsicle-domain-name-search/id511364723?ls=1&mt=8'); // or itms://
    } else if ($ionicPlatform.is('android')) {
      console.log("Chamei Market!");
      window.open('market://details?id=com.ionicframework.astrocatalogue929666');
    }
  }

  $scope.rate = function(){
    //   //1
    //   AppRate.preferences.useLanguage = 'en';
    //   // 2
    //   var popupInfo = {};
    //   popupInfo.title = "Rate AstroCatalogue";
    //   popupInfo.message = "You like AstroCatalogue ? We would be glad if you share your experience with others. Thanks for your support!";
    //   popupInfo.cancelButtonLabel = "No, thanks";
    //   popupInfo.laterButtonLabel = "Remind Me Later";
    //   popupInfo.rateButtonLabel = "Rate Now";
    //   popupInfo.cssClass = "confirm-popup";
    //   AppRate.preferences.customLocale = popupInfo;
    //   // 3
    //   AppRate.preferences.openStoreInApp = true;
    //   // 4
    //   //AppRate.preferences.storeAppURL.android = '849930087';
    //   AppRate.preferences.storeAppURL.android = "market://details?id=com.ionicframework.astrocatalogue929666",
    //   // ?id=<package_name>';
    //   // 5
    //   AppRate.promptForRating(true);
    // //  AppRate.navigateToAppStore().then(function (result) {
    //     // success
    // //  });
    AppRate.preferences = {
      openStoreInApp: true,
      displayAppName: 'My custom app title',
      usesUntilPrompt: 5,
      promptAgainForEachNewVersion: false,
      useCustomRateDialog: true,
      storeAppURL: {
        ios: '<my_app_id>',
        android: 'market://details?id=com.ionicframework.astrocatalogue929666',
        windows: 'ms-windows-store://pdp/?ProductId=<the apps Store ID>',
        blackberry: 'appworld://content/[App Id]/',
        windows8: 'ms-windows-store:Review?name=<the Package Family Name of the application>'
      },

      customLocale: {
        title: "Rate %@",
        message: "You like AstroCatalogue ? We would be glad if you share your experience with others. Thanks for your support!",
        cancelButtonLabel: "No, Thanks",
        laterButtonLabel: "Remind Me Later",
        rateButtonLabel: "Rate It Now"
      }
    };

  }

  $scope.goHelp = function(){
    $state.go('app.help');
  }

  $scope.dssack = function(){
    $state.go('app.dssack');
  }

  $scope.dsscopy = function(){
    $state.go('app.dsscopy');
  }

  $scope.about = function(){
    $state.go('app.about');
  }

  $scope.exit = function(){
    if (navigator) navigator.app.exitApp();
    ionic.Platform.exitApp();
  }

  // Set Motion
  $timeout(function() {
    ionicMaterialMotion.slideUp({
      selector: '.slide-up'
    });
  }, 200);

  $timeout(function() {
    ionicMaterialMotion.fadeSlideInRight({
      startVelocity: 3000
    });
  }, 500);

  // Set Ink
  ionicMaterialInk.displayEffect();
})

.controller('ActivityCtrl', function($scope, $rootScope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
  $scope.$parent.showHeader();
  $scope.$parent.clearFabs();
  $scope.isExpanded = true;
  $scope.$parent.setExpanded(true);
  $scope.$parent.setHeaderFab('right');

  $timeout(function() {
    ionicMaterialMotion.fadeSlideIn({
      selector: '.animate-fade-slide-in .item'
    });
  }, 200);

  // Activate ink for controller
  ionicMaterialInk.displayEffect();
})

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
  $scope.$parent.showHeader();
  $scope.$parent.clearFabs();
  $scope.isExpanded = true;
  $scope.$parent.setExpanded(true);
  $scope.$parent.setHeaderFab(false);

  // Activate ink for controller
  ionicMaterialInk.displayEffect();

  ionicMaterialMotion.pushDown({
    selector: '.push-down'
  });
  ionicMaterialMotion.fadeSlideInRight({
    selector: '.animate-fade-slide-in .item'
  });

})

;

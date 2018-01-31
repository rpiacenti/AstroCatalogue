angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.activity', {
        url: '/activity/:obj',
        views: {
            'menuContent': {
                templateUrl: 'templates/activity.html',
                controller: 'ActivityCtrl'
            }
        }
    })

    .state('app.friends', {
        url: '/friends',
        views: {
            'menuContent': {
                templateUrl: 'templates/friends.html',
                controller: 'FriendsCtrl'
            }
        }
    })

   .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            }
        }
    })

    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            }
        }
    })

    .state('app.help', {
        url: '/help',
        views: {
            'menuContent': {
                templateUrl: 'templates/astroSACDoc.html',
                controller: 'ProfileCtrl'
            }
        }
    })

    .state('app.about', {
        url: '/about',
        views: {
            'menuContent': {
                templateUrl: 'templates/aboutAstrocatalogue.html',
                controller: 'ProfileCtrl'
            }
        }
    })

    .state('app.dssack', {
        url: '/dssack',
        views: {
            'menuContent': {
                templateUrl: 'templates/dssack.html',
                controller: 'ProfileCtrl'
            }
        }
    })

    .state('app.dsscopy', {
        url: '/dsscopy',
        views: {
            'menuContent': {
                templateUrl: 'templates/dsscopy.html',
                controller: 'ProfileCtrl'
            }
        }
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
});

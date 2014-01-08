'use strict';
/*
 * Feeds Controller
 *
 */
function FeedsCtrl($scope, $rootScope, $feedsService, $location, $filter, ngTableParams, $cacheFactory) {

  var breadcrumbs = [
    {
      name: "Feeds",
      url: $location.absUrl()
    }
  ];

  // initialize page header variables
  $rootScope.setPageHeader("Feeds", breadcrumbs, "feeds", null);

  // call our services
  $feedsService.getFeeds()
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feeds = data;

      // sets the defaults for the table sorting parameters
      $scope.feedTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, 10, {date: 'asc'});

    }).error(function (data) {

      $rootScope.pageHeader.error = "Could not retrieve Feeds Data.";
    });
}

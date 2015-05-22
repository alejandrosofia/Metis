'use strict';
/*
 * Feeds Overview Controller
 *
 */
function FeedOverviewCtrl($scope, $rootScope, $feedsService, $routeParams, $location, $appProperties, $filter, ngTableParams) {

  // get the vipfeed param from the route
  var feedid = $routeParams.vipfeed;
  $scope.vipfeed = feedid;

  // initialize page header variables
  $rootScope.setPageHeader("", $rootScope.getBreadCrumbs(), "feeds", "", null);

  // get general Feed data
  $feedsService.getFeedData(feedid)
    .success(function (data, $http) {

      // set the feeds data into the Angular model
      $scope.feedData = data;
      $rootScope.feedData = data;

      // set the title
      $rootScope.pageHeader.title = data.title;

      // now call the other services to get the rest of the data
      FeedOverviewCtrl_getFeedPollingLocations($scope, $rootScope, $feedsService, data.polling_locations, $appProperties, $filter, ngTableParams);
      FeedOverviewCtrl_getFeedContests($scope, $rootScope, $feedsService, data.contests, $appProperties, $filter, ngTableParams);
      FeedOverviewCtrl_getFeedLocalities($scope, $rootScope, $feedsService, data.localities, $appProperties, $filter, ngTableParams);

    }).error(function (data, $http) {

      if($http===404){
        // feed not found

        $rootScope.pageHeader.alert = "Sorry, the VIP feed \"" + feedid + "\" does not exist.";
      } else {
        // some other error

        $rootScope.pageHeader.error += "Could not retrieve Feed data. ";
      }

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedData = {};
      $scope.feedPollingLocations = {};
      $scope.feedContests = {};
      $scope.feedLocalities = {};
      $scope.feedCounties = {};
    });
}

/*
 * Get the Feed Polling Locations for the Feed Overview page
 *
 */
function FeedOverviewCtrl_getFeedPollingLocations($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams){

  // get Polling Locations
  $feedsService.getFeedPollingLocations(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedPollingLocations = data;

      $scope.pollingTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, $appProperties.lowPagination, { element_type: 'asc' });

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Polling Locations. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedPollingLocations = {};
    });
}

/*
 * Get the Feed Contests for the Feed Overview page
 *
 */
function FeedOverviewCtrl_getFeedContests($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams){

  // get Contests
  $feedsService.getFeedContests(servicePath)
    .success(function (data) {

      // set the feeds data into the Angular model
      $scope.feedContests = data;
      $scope.contestTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, $appProperties.lowPagination, { element_type: 'asc' });

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Contests. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedContests = {};
    });
}

/*
 * Get the Feed Localities for the Feed Overview page
 *
 */
function FeedOverviewCtrl_getFeedLocalities($scope, $rootScope, $feedsService, servicePath, $appProperties, $filter, ngTableParams){

  // get Results
  $feedsService.getFeedLocalities(servicePath)
    .success(function (data) {

      // use the self property to use as the linked URL for each item
      $rootScope.changeSelfToAngularPath(data);

      // set the feeds data into the Angular model
      $scope.feedLocalities = data;
      $scope.localTableParams = $rootScope.createTableParams(ngTableParams, $filter, data, $appProperties.lowPagination, { id: 'asc' });

    }).error(function (data) {

      $rootScope.pageHeader.error += "Could not retrieve Feed Localities. ";

      // so the loading spinner goes away and we are left with an empty table
      $scope.feedLocalities = {};
    });
}
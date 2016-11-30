'use strict';

function FeedSource51Ctrl($scope, $rootScope, $routeParams,  $feedDataPaths, $location) {
  var publicId = $scope.publicId = $routeParams.vipfeed;

  $scope.pageHeader.title = 'Source & Election';
  $rootScope.setPageHeader("Source", [], "feeds", "", null);

  $feedDataPaths.getResponse({path: '/db/5.1/feeds/' + publicId + '/source',
                              scope:  $scope,
                              key: 'source',
                              errorMessage: 'Could not retrieve source' },
                             function (res) {
                               $scope.source = res[0];
                               console.log('Got a source response: ' + JSON.stringify($scope.source));
                             });

  $feedDataPaths.getResponse({path: '/db/5.1/feeds/' + publicId + '/election',
                              scope: $scope,
                              key: 'election',
                              errorMessage: 'Could not retrieve election' },
                             function (res) {
                               $scope.election = res[0];
                               console.log('Got an election response:' + JSON.stringify($scope.election));
                             });
}

angular.module('app').directive('userAvatar', function() {
  return {
    restrict: "E",
    template: '<img src="{{avatarUrl}}" alt="{{uuid}}" class="circle">',
    scope: {
      uuid: "@",
    },
    controller: function($scope, $http){
      $http({
        method: 'GET',
        url: 'https://randomuser.me/api/'
      }).then(function successCallback(response) {
        $scope.avatarUrl = response.data['results'][0]['picture']['thumbnail'];
       // $scope.avatarUrl = '//avatars.io/twitter/' + $scope.uuid + 'small';
      }, function errorCallback(response) {
        console.log('err');
      });


    }
  };
});

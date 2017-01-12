angular.module('app').directive('messageItem', function(MessageService) {
  return {
    restrict: "E",
    templateUrl: 'components/message-item/message-item.html',
    scope: {
      senderUuid: "@",
      content: "@",
      date: "@"
    },
    controller: function($scope, $http){
      $http({
        method: 'GET',
        url: 'https://randomuser.me/api/'
      }).then(function successCallback(response) {
        $scope.firstName = response.data['results'][0]['name']['first'];
        $scope.lastName = response.data['results'][0]['name']['last'];
        $scope.titleName = response.data['results'][0]['name']['title'];
      }, function errorCallback(response) {
        console.log('err');
      });


    }
  };
});

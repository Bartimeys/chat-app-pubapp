angular.module('app').directive('messageForm', function () {
  return {
    restrict: "E",
    replace: true,
    templateUrl: 'components/message-form/message-form.html',
    scope: {},

    controller: function ($scope, $http, currentUser, MessageService) {

      $scope.uuid = currentUser;
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

      $scope.messageContent = '';

      $scope.sendMessage = function () {
        MessageService.sendMessage($scope.messageContent);
        $scope.messageContent = '';
      }
    }
  };
});

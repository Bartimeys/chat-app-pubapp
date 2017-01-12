  angular
  .module('app')
  .run(['Pubnub','currentUser', function(Pubnub, currentUser) {

    Pubnub.init({
          publish_key: 'pub-c-409cb868-a8ca-44c7-aa7b-fc5cdec1a7a8',
          subscribe_key: 'sub-c-5cf76042-d8ac-11e6-a0b3-0619f8945a4f',
          uuid: currentUser,
          origin: 'pubsub.pubnub.com',
          ssl: true,
          heartbeat: 40,
          heartbeat_interval: 60
      });

  }])
  .run(['ngNotify', function(ngNotify) {

      ngNotify.config({
          theme: 'paster',
          position: 'top',
          duration: 250
      });

  }]);

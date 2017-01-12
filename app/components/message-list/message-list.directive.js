angular.module('app').directive('messageList', function($rootScope, $anchorScroll, MessageService, ngNotify) {
  return {
    restrict: "E",
    replace: true,
    templateUrl: 'components/message-list/message-list.html',

    link: function(scope, element, attrs, ctrl) {

      var element = angular.element(element)

      var scrollToBottom = function() {
          element.scrollTop(element.prop('scrollHeight'));
      };

      var hasScrollReachedBottom = function(){
        return element.scrollTop() + element.innerHeight() >= element.prop('scrollHeight')
      };

      var hasScrollReachedTop = function(){
        return element.scrollTop() === 0 ;
      };

      var fetchPreviousMessages = function(){

        ngNotify.set('Loading previous messages...','success');

        var currentMessage = MessageService.getMessages()[0].uuid

        MessageService.fetchPreviousMessages().then(function(m){

          // Scroll to the previous message
          $anchorScroll(currentMessage);

        });

      };

      var watchScroll = function() {

        if(hasScrollReachedTop()){

          if(MessageService.messagesAllFetched()){
            ngNotify.set('All the messages have been loaded', 'grimace');
          }
          else {
            fetchPreviousMessages();
          }
        }

        // Update the autoScrollDown value
        scope.autoScrollDown = hasScrollReachedBottom()

      };

      var init = function(){

          // Scroll down when the list is populated
          var unregister = $rootScope.$on('factory:message:populated', function(){
            // Defer the call of scrollToBottom is useful to ensure the DOM elements have been loaded
            _.defer(scrollToBottom);
            unregister();

          });

          // Scroll down when new message
          MessageService.subscribeNewMessage(function(){
            if(scope.autoScrollDown){
              scrollToBottom()
            }
          });

          // Watch the scroll and trigger actions
          element.bind("scroll", _.debounce(watchScroll,250));
      };

      init();

    },
    controller: function($scope){
      // Auto scroll down is acticated when first loaded
      $scope.autoScrollDown = true;

      $scope.messages = MessageService.getMessages();
      <!-- Map Configuration and data -->
      var map;
      var map_marker;
      var lat = null;
      var lng = null;
      var lineCoordinatesArray = [];

      // sets your location as default
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var locationMarker = null;
            if (locationMarker){
              // return if there is a locationMarker bug
              return;
            }

            lat = position.coords["latitude"];
            lng = position.coords["longitude"];

            // calls PubNub
            pubs();

            // initialize google maps
            google.maps.event.addDomListener(window, 'load', initialize());
          },
          function(error) {
            console.log("Error: ", error);
          },
          {
            enableHighAccuracy: true
          }
        );
      }


      function initialize() {
        console.log("Google Maps Initialized")
        map = new google.maps.Map(document.getElementById('map-canvas'), {
          zoom: 15,
          center: {lat: lat, lng : lng, alt: 0}
        });

        map_marker = new google.maps.Marker({position: {lat: lat, lng: lng}, map: map});
        map_marker.setMap(map);
      }

      // moves the marker and center of map
      function redraw() {
        map.setCenter({lat: lat, lng : lng, alt: 0})
        map_marker.setPosition({lat: lat, lng : lng, alt: 0});
        pushCoordToArray(lat, lng);

        var lineCoordinatesPath = new google.maps.Polyline({
          path: lineCoordinatesArray,
          geodesic: true,
          strokeColor: '#2E10FF',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

        lineCoordinatesPath.setMap(map);
      }


      function pushCoordToArray(latIn, lngIn) {
        lineCoordinatesArray.push(new google.maps.LatLng(latIn, lngIn));
      }


      function pubs() {
        pubnub = PUBNUB.init({
          publish_key: 'pub-c-409cb868-a8ca-44c7-aa7b-fc5cdec1a7a8',
          subscribe_key: 'sub-c-5cf76042-d8ac-11e6-a0b3-0619f8945a4f'
        });

        pubnub.subscribe({
          channel: "mymaps",
          message: function(message, channel) {
            console.log(message);
            lat = message['lat'];
            lng = message['lng'];
            //custom method
            redraw();
          },
          connect: function() {console.log("PubNub Connected")}
        })
      }

    }

  };
});

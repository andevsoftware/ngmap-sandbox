(function() {
    'use strict';

    angular
        .module('app')
        .controller('App', App);

    function App($http, GoogleMaps, GoogleMapMarker, DrawingManager) {

        var vm = this;
        vm.onInit = onInit;

        vm.setMapType = setMapType;
        vm.setMarkerType = setMarkerType;
        vm.setSelectionMode = setSelectionMode;
        vm.clearSelections = clearSelections;

        activate();

        ////////////////////////

        function onInit(googleMap) {

            // Set initial map & marker type
            googleMap.setMapType('roadmap');
            googleMap.setMarkerType('label');

            // Attach a DrawingManager instance
            googleMap.setDrawingManager(new DrawingManager());

            fetchData().then(function(data){

                data = _.map(data.data, function(obj) {

                    return GoogleMapMarker.build({
                        selected: false,
                        latitude: obj.location_latitude,
                        longitude: obj.location_longitude,
                        color: randomColor(),
                        events: {
                            onClick: function() {

                                this.attrs.selected = !this.attrs.selected;
                            },
                            onSelect: function() {

                                this.attrs.selected = true;
                            }
                        },
                        markerType: function() {
                            return googleMap.getMarkerType();
                        },
                        value: function() {
                            return obj.id || 'no id';
                        }
                    });
                });

                googleMap.setMarkers(data);
            });
        }

        function activate() {


        }

        function randomColor() {

            var colors = [
                // purple
                {
                    fillColor: '#aa26ce',
                    strokeColor: '#551266',
                },
                // blue
                {
                    fillColor: '#00bccf',
                    strokeColor: '#006569',
                },
                // green 
                {
                    fillColor: '#55a400',
                    strokeColor: '#3f6900',
                },
                // yellow
                {
                    fillColor: '#f4b000',
                    strokeColor: '#997a0b',
                },
                // red
                {
                    fillColor: '#be1f24',
                    strokeColor: '#661217',
                }
            ];

            var index = Math.floor(Math.random() * colors.length - 1) + 1;  

            return colors[index];
        }

        function fetchData() {

        	return $http.get('data/data.json');
        }

        ////////////////////////

        function setMapType(type) {

            var map = GoogleMaps.get('main-map');
            map.setMapType(type);
        }

        function setMarkerType(type) {

            var map = GoogleMaps.get('main-map');
            console.log(map);

            map.setMarkerType(type);
            console.log(map.getMarkerType());
        }

        function setSelectionMode(mode) {

            var map = GoogleMaps.get('main-map');
            var drawingManager = map.getDrawingManager();
            drawingManager.setDrawingMode(mode);
        }

        function clearSelections() {

            var map = GoogleMaps.get('main-map');
            var drawingManager = map.getDrawingManager();
            drawingManager.clearDrawings();
        }

    }
})();
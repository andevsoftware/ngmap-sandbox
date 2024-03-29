(function() {
    'use strict';

    angular
        .module('blocks.google-map')
        .provider('$googleMap', GoogleMap);

    function GoogleMap() {

        var options = {
            markerType: null
        };
        
        var defaultOptions = {
            panControl: true,
            zoomControl: true,
            scaleControl: true,
            zoom: 4,
        };

        this.configure = function(globalOptions) {

            _.extend(defaultOptions, globalOptions);
        };

        this.$get = GoogleMapFactory;

        function GoogleMapFactory($window, google, GoogleMaps) {
            
            function GoogleMap(name, map, localOptions) {

                var googleMap = this;

                this.options = _.extend(defaultOptions, localOptions);
                this.name = name;
                this.map = map;
                this.markers = [];

                this.initialize();

                //////////////////////////////////

                GoogleMaps.set(name, this);
            };

            /**
             * Public methods
             */

            // Map: Initialize the map with options
            GoogleMap.prototype.initialize = function() {

                this.map.setOptions(this.options);
            };

            // Map: Remove the map from the GoogleMaps container
            GoogleMap.prototype.destroy = function() {

                GoogleMaps.remove(this);
            };

            // Map: Get the map instance
            GoogleMap.prototype.getMap = function() {
                
                return this.map;
            };

            // Map: Get local options
            GoogleMap.prototype.getOptions = function() {

                return this.options;
            };

            // Map: Set the map type eg labels, pinpoints, default
            GoogleMap.prototype.setMapType = function(type) {

                switch (type) {

                    case 'satellite':
                        this.map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
                        break;
                    case 'roadmap':
                    default: 
                        this.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                        break;
                }
            };

            // Map: center to markers with optional predicate
            GoogleMap.prototype.centerToMarkers = function(predicate) {

                var bounds = this.getMarkersBounds(predicate);

                this.map.fitBounds(bounds);
            };

            // Markers: get bounds of markers with optional predicate
            GoogleMap.prototype.getMarkersBounds = function(predicate) {

                var markers = this.getMarkers(predicate);

                // Create a new bounds object
                var bounds = new google.maps.LatLngBounds();

                _.each(markers, function(googleMarker) {

                    var marker = googleMarker.getMarker();
                    var position = marker.getPosition();

                    bounds.extend(position);
                });
                
                return bounds;
            };

            // Markers: Set the marker type eg labels, pinpoints, default
            GoogleMap.prototype.setMarkerType = function(markerType) {

                options.markerType = markerType;
                this.updateMarkers();
            };

            // Markers: Get the marker type
            GoogleMap.prototype.getMarkerType = function() {

                return options.markerType;
            };

            // Markers: Replace existing markers with new markers
            GoogleMap.prototype.setMarkers = function(markers) {

                var googleMap = this;

                // Delete old markers
                this.deleteMarkers();

                // Set new markers
                this.markers = markers;
                this.showMarkers();
            };

            // Markers: Returns the local array with markers with optional predicate
            GoogleMap.prototype.getMarkers = function(predicate) {

                var markers = this.markers;

                if (predicate) {
                    markers = _.filter(markers, predicate);
                }

                return markers;
            };

            // Markers: Sets the map on all markers in the array.
            GoogleMap.prototype.setAllMap = function(map) {

                var self = this;

                _.each(this.markers, function(marker) {

                    marker.createMarker().setMap(self.map);
                });
            };

            // Markers: Updates all markers by resetting the options
            GoogleMap.prototype.updateMarkers = function() {

                _.each(this.markers, function(marker) {

                    marker.updateMarker();
                });
            };

            // Markers: Removes the markers from the map, but keeps them in the array.
            GoogleMap.prototype.clearMarkers = function() {
                
                this.setAllMap(null);
            };

            // Markers: Shows any markers currently in the array.
            GoogleMap.prototype.showMarkers = function() {
                
                this.setAllMap(this.map);
            };

            // Markers: Deletes all markers in the array by removing references to them.
            GoogleMap.prototype.deleteMarkers = function() {

                this.clearMarkers();
                this.markers = [];
            };

            // DrawingManager: Attach instance of a drawing manager to map
            GoogleMap.prototype.setDrawingManager = function(drawingManager) {

                drawingManager.setGoogleMap(this);
                this.drawingManager = drawingManager;
            };

            // DrawingManager: Get the drawing manager instance
            GoogleMap.prototype.getDrawingManager = function() {

                return this.drawingManager;
            };

            /**
             * Static methods
             */

            // Static: Create new GoogleMap instance
            GoogleMap.create = function(options) {

                return new GoogleMap(options);
            };

            return GoogleMap;
        }
    }
})();
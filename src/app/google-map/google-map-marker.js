(function() {
    'use strict';

    angular
        .module('blocks.google-map')
        .provider('GoogleMapMarker', GoogleMapMarkerProvider);

        function GoogleMapMarkerProvider() {

            var markerTypes = {};

            this.setMarkerType = function(name, callback) {

                markerTypes[name] = callback;
            };

            this.$get = GoogleMapMarkerFactory;

            function GoogleMapMarkerFactory(google, GoogleMapMarkerWithLabel) {
                
                function GoogleMapMarker(attrs) {

                    _.extend(this, attrs);
                }

                GoogleMapMarker.prototype.createOptions = function() {

                    var type = this.getMarkerType();
                    var optionsFn = markerTypes[type];

                    return optionsFn.apply(this, [google]);
                };

                GoogleMapMarker.prototype.getMarker = function() {

                    return this.marker;
                };

                GoogleMapMarker.prototype.createMarker = function() {

                    var self = this;

                    // Destroy previous reference
                    if (this.marker && this.marker.setMap) {
                        this.marker.setMap(null);
                    }

                    this.marker = new GoogleMapMarkerWithLabel(this.createOptions());
                  
                    // Attach events
                    google.maps.event.addListener(this.marker, 'click', function() {

                        if (!self.events || !self.events.onClick) {
                            return;
                        }

                        self.events.onClick.apply(self, arguments);

                        self.updateMarker();
                    });    

                    return this.marker;
                };

                GoogleMapMarker.prototype.updateMarker = function() {

                    var options = this.createOptions();
                    this.marker.setOptions(options);
                };

                // DrawingManager: delegate methods
                GoogleMapMarker.prototype.onSelect = function() {

                    if (!this.events || !this.events.onSelect) {
                        return;
                    }

                    this.events.onSelect.apply(this, arguments);
                };

                GoogleMapMarker.build = function(attrs) {

                    return new GoogleMapMarker(attrs);
                };

                return GoogleMapMarker;
            }
        }
})();
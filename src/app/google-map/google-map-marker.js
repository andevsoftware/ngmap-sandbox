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

                    this.attrs = attrs;
                }

                GoogleMapMarker.prototype.parseAttrs = function(attrs) {

                    var parsed = {};

                    _.each(attrs, function (attr, key) {

                        if (_.isFunction(attr)) {

                            return parsed[key] = attr.apply(this, []);
                        }

                        return parsed[key] = attr;
                    });

                    return parsed;
                };

                GoogleMapMarker.prototype.getMarkerType = function(name, data) {

                    return markerTypes[name].apply(this, [google, data]);
                };

                GoogleMapMarker.prototype.getMarker = function() {

                    return this.marker;
                };

                GoogleMapMarker.prototype.getDetails = function() {

                    return this.parsedAttrs || {};
                };

                GoogleMapMarker.prototype.createMarker = function() {

                    var self = this;

                    // Destroy previous reference
                    if (this.marker && this.marker.setMap) {
                        this.marker.setMap(null);
                    }

                    this.parsedAttrs = this.parseAttrs(this.attrs);

                    this.marker = new GoogleMapMarkerWithLabel(this.getMarkerType(this.parsedAttrs.markerType, this.parsedAttrs));
                  
                    // Attach events
                    google.maps.event.addListener(this.marker, 'click', function() {

                        if (!self.attrs.events || !self.attrs.events.onClick) {
                            return;
                        }

                        self.attrs.events.onClick.apply(self, arguments);

                        self.updateMarker();
                    });    

                    return this.marker;
                };

                GoogleMapMarker.prototype.updateMarker = function() {

                    var attrs = this.parseAttrs(this.attrs);

                    this.marker.setOptions(this.getMarkerType(attrs.markerType, attrs));
                };

                // DrawingManager: delegate methods
                GoogleMapMarker.prototype.onSelect = function() {

                    if (!this.attrs.events || !this.attrs.events.onSelect) {
                        return;
                    }

                    this.attrs.events.onSelect.apply(this, arguments);
                };

                GoogleMapMarker.build = function(attrs) {

                    return new GoogleMapMarker(attrs);
                };

                return GoogleMapMarker;
            }
        }
})();
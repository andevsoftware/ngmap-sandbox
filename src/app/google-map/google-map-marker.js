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

                    var self = this;

                    // Destroy previous reference
                    if (this.marker && this.marker.setMap) {
                        this.marker.setMap(null);
                    }

                    var attrs = this.parseAttrs(this.attrs);

                    this.marker = new GoogleMapMarkerWithLabel(this.getMarkerType(attrs.markerType, attrs));
                    google.maps.event.addListener(this.marker, 'click', function() {

                        self.onClick.apply(self, arguments);
                    });

                    return this.marker;
                };

                GoogleMapMarker.prototype.updateMarker = function() {

                    var attrs = this.parseAttrs(this.attrs);

                    this.marker.setOptions(this.getMarkerType(attrs.markerType, attrs));
                };

                GoogleMapMarker.prototype.onClick = function(bla) {

                    console.log('clicked: ', this, bla);

                    this.attrs.selected = !this.attrs.selected;

                    this.updateMarker();
                };

                GoogleMapMarker.build = function(attrs) {

                    return new GoogleMapMarker(attrs);
                };

                return GoogleMapMarker;
            }
        }
})();
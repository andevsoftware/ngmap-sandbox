(function() {
    'use strict';

    angular
        .module('blocks.google-map')
        .factory('GoogleMaps', GoogleMapsFactory);

    function GoogleMapsFactory() {
        
        function GoogleMaps() {

        	this.maps = {};
        }

        GoogleMaps.prototype.set = function(name, value) {

        	this.maps[name] = value;
        };

        GoogleMaps.prototype.remove = function(name) {

            return delete this.maps[name];
        }

        GoogleMaps.prototype.get = function(name) {

        	return this.maps[name];
        };

        return new GoogleMaps();
    }
})();
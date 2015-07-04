(function() {
    'use strict';

    angular
        .module('blocks.google-map', [])
        .value('google', window.google)
        .value('GoogleMapMarkerWithLabel', window.MarkerWithLabel);
})();
(function() {
    'use strict';

    angular
        .module('blocks.google-map')
        .directive('googleMap', googleMap);

    function googleMap($googleMap, $timeout, google) {

        var directive = {
            link: link,
            restrict: 'A',
            templateUrl: 'templates/google-map.tpl.html',
            scope: {
                name: '=mapName',
            	onInit: '&onInit',
            }
        };
        return directive;

        function link(scope, element, attrs) {

        	var googleMap;

            scope.$on('mapInitialized', function(event, map) {

                var googleMap = new $googleMap(scope.name, map);

                if (scope.onInit) {

                    scope.onInit({ map: googleMap });
                }
            });

            scope.$on('$destroy', function() {

                googleMap && googleMap.destroy();
            });
            
        }
    }
})();
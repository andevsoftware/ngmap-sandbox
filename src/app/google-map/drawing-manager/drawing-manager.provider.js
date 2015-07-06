(function() {
    'use strict';

    angular
        .module('blocks.google-map')
        .provider('DrawingManager', DrawingManagerProvider);

    function DrawingManagerProvider() {

        var defaultOptions = {

        };
        
        this.configure = function(globalOptions) {

            _.extend(defaultOptions, globalOptions);
        };

        this.$get = DrawingManagerFactory;

        function DrawingManagerFactory(google) {

            function DrawingManager(localOptions, map) {

                this.options = _.extend(defaultOptions, localOptions);

                this.overlays = [];

                this.createManager();
            }

            // Manager: Create new instance
            DrawingManager.prototype.createManager = function() {

                this.manager = new google.maps.drawing.DrawingManager(this.options);
            };
 
            // Manager: Get manager
            DrawingManager.prototype.getManager = function() {

                return this.manager;
            };

            // Manager: Set GoogleMap
            DrawingManager.prototype.setGoogleMap = function(googleMap) {

                this.googleMap = googleMap;

                // Obtain the map
                var map = googleMap.getMap();
                this.setMap(map);
            };

            // Manager: Set map
            DrawingManager.prototype.setMap = function(map) {

                this.manager.setMap(map);
                this.initManager();
            };

            // Manager: Initialize (map has been attached)
            DrawingManager.prototype.initManager = function() {

                var self = this;
                var drawingManager = this.manager;
                var map = this.map;

                self.selectColor('#1E90FF');
                self.setDrawingMode(null);

                google.maps.event.addListener(drawingManager, 'overlaycomplete', function() {

                    self.onOverlayComplete.apply(self, arguments);
                });

                // Setup event handler: Fires when user has finished drawing a polygon
                google.maps.event.addListener(drawingManager, 'polygoncomplete', function() {

                    self.onPolygonComplete.apply(self, arguments);
                });

                // Setup event handler: Fires when user has finished drawing a rectangle
                google.maps.event.addListener(drawingManager, 'rectanglecomplete', function() {

                    self.onRectangleComplete.apply(self, arguments);
                });
            };

            // Manager: Set drawing mode
            DrawingManager.prototype.setDrawingMode = function(mode) {

                var drawingMode;

                switch(mode) {

                    case 'rectangle':
                        drawingMode = google.maps.drawing.OverlayType.RECTANGLE;
                        break;
                    case 'polygon':
                        drawingMode = google.maps.drawing.OverlayType.POLYGON;
                        break;
                    default:
                    case 'none':
                        drawingMode = null;
                        break;
                }

                this.manager.setOptions({ drawingMode: drawingMode });
            };

            // Manager: Clear drawings
            DrawingManager.prototype.clearDrawings = function() {

                _.each(this.overlays, function(overlay) {
                    overlay.setMap(null);
                });
            };

            // Selection: Select color for shapes
            DrawingManager.prototype.selectColor = function(color) {

                var drawingManager = this.manager;

                this.selectedColor = color;

                // Retrieves the current options from the drawing manager and replaces the
                // stroke or fill color as appropriate.
                var rectangleOptions = drawingManager.get('rectangleOptions');
                rectangleOptions.fillColor = color;
                drawingManager.set('rectangleOptions', rectangleOptions);

                var polygonOptions = drawingManager.get('polygonOptions');
                polygonOptions.fillColor = color;
                drawingManager.set('polygonOptions', polygonOptions);
            };

            // Selection: Gets fired when user has drawn polygon/rectangle
            DrawingManager.prototype.onOverlayComplete = function(e) {

                this.overlays = this.overlays || [];
                this.overlays.push(e.overlay);
            };

            // Selection: Gets fired when user has drawn polygon
            DrawingManager.prototype.onPolygonComplete = function(polygon) {

                var self = this;
                var drawingManager = this.manager;

                // First set drawing mode back to null
                // So that the user is directly able to use
                // the drag handles to reshape the polygon
                drawingManager.setDrawingMode(null);

                // Here we attach the event needed
                // to get notified when the user reshapes the polygon 
                // using the handles
                google.maps.event.addListener(polygon.getPath(), 'insert_at', function(index, obj) {
                    self.getMarkersInsidePolygon(polygon);
                });
                google.maps.event.addListener(polygon.getPath(), 'set_at', function(index, obj) {
                    self.getMarkersInsidePolygon(polygon);
                });

                // Get markers and trigger select
                this.selectMarkersInsidePolygon();
            };

            // Polygon Selection: Get markers that are inside
            DrawingManager.prototype.selectMarkersInsidePolygon = function(polygon) {

                var markers = this.getMarkersInsidePolygon(polygon);

                _.each(markers, function(marker) {

                    marker.onSelect();
                });

                // Make sure the markers refresh their properties
                this.googleMap.updateMarkers();
            }

            // Polygon Selection: Get markers that are inside
            DrawingManager.prototype.getMarkersInsidePolygon = function(polygon) {

                var self = this;

                // Here we loop through the existing markers
                // Checking for each whether they are inside the polygon
                var markers = _.filter(self.googleMap.getMarkers(), function(googleMarker) {

                    var marker = googleMarker.getMarker();
                    var position = marker.getPosition();

                    if (polygon.containsLatLng(position)) {

                        return googleMarker;
                    }
                });

                return markers;
            };

            // Selection: Gets fired when user has drawn polygon
            DrawingManager.prototype.onRectangleComplete = function(rectangle) {

                // Get the markers
                var self = this;
                var drawingManager = this.manager;

                // First set drawing mode back to null
                // So that the user is directly able to use
                // the drag handles to reshape the rectangle
                drawingManager.setDrawingMode(null);

                // Here we attach the event needed
                // to get notified when the user reshapes the rectangle 
                // using the handles
                google.maps.event.addListener(rectangle, 'bounds_changed', function(index, obj) {
                    self.selectMarkersInsideRectangle(rectangle);
                });

                // Get markers and trigger select
                this.selectMarkersInsideRectangle(rectangle);

                
            };

            // Rectangle Selection: Select markers that are inside rectangle
            DrawingManager.prototype.selectMarkersInsideRectangle = function(rectangle) {

                var markers = this.getMarkersInsideRectangle(rectangle);

                _.each(markers, function(marker) {

                    marker.onSelect();
                });

                // Make sure the markers refresh their properties
                this.googleMap.updateMarkers();
            };

            // Rectangle Selection: Get markers that are inside rectangle
            DrawingManager.prototype.getMarkersInsideRectangle = function(rectangle) {

                var self = this;

                // First get bounds
                var bounds = rectangle.getBounds();

                // Then, for each marker
                // Check if it's inside those bounds
                var markers = _.filter(self.googleMap.getMarkers(), function(googleMarker) {

                    var marker = googleMarker.getMarker();
                    var position = marker.getPosition();

                    if (bounds.contains(position)) {
                        return googleMarker;
                    }

                    return false;
                });

                return markers;
            };

            return DrawingManager;
        }
    }
})();
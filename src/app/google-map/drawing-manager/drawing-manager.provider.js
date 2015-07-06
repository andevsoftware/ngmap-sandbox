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

                this.createManager();
            }

            // Manager: Create new instance
            DrawingManager.prototype.createManager = function() {

                this.manager = new google.maps.drawing.DrawingManager(this.options);

                console.debug('manager', this.manager);
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

                // Setup event handler: Fires when user has finished drawing a polygon
                google.maps.event.addListener(drawingManager, 'polygoncomplete', function() {

                    self.onPolygonComplete.apply(self, arguments);
                });

                // Setup event handler: Fires when user has finished drawing a rectangle
                google.maps.event.addListener(drawingManager, 'rectanglecomplete', function() {

                    self.onRectangleComplete.apply(self, arguments);
                });

                google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {

                    if (e.type != google.maps.drawing.OverlayType.MARKER) {
                        
                        // Switch back to non-drawing mode after drawing a shape.
                        // drawingManager.setDrawingMode(null);

                        // Add an event listener that selects the newly-drawn shape when the user
                        // mouses down on it.
                        // var newShape = e.overlay;
                        // newShape.type = e.type;
                        // google.maps.event.addListener(newShape, 'click', function() {
                            // self.setSelection(newShape);
                        // });

                        // self.setSelection(newShape);
                    }
                });

                // Clear the current selection when the drawing mode is changed, or when the
                // map is clicked.
                google.maps.event.addListener(drawingManager, 'drawingmode_changed', function(e) {

                    // console.debug('drawingmode_changed', e);
                    // self.clearSelection();
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

            // Selection: Gets fired when user has drawn polygon
            DrawingManager.prototype.onPolygonComplete = function(polygon) {

                var self = this;
                var drawingManager = this.manager;

                // First set drawing mode back to null
                // So that the user is directly able to use
                // the drag handles to reshape the polygon
                drawingManager.setDrawingMode(null);

                console.debug('Okay, so here we have a drawed polygon', polygon);

                // Here we attach the event needed
                // to get notified when the user reshapes the polygon 
                // using the handles
                google.maps.event.addListener(polygon.getPath(), 'insert_at', function(index, obj) {
                    console.debug('insert_at', index, obj);
                    self.getMarkersInsidePolygon(polygon);
                });
                google.maps.event.addListener(polygon.getPath(), 'set_at', function(index, obj) {
                    console.debug('set at', index, obj);
                    self.getMarkersInsidePolygon(polygon);
                });

                // Get markers
                this.getMarkersInsidePolygon(polygon);
            };

            DrawingManager.prototype.getMarkersInsidePolygon = function(polygon) {

                var self = this;

                // Here we loop through the existing markers
                // Checking for each whether they are inside the polygon
                _.each(self.googleMap.getMarkers(), function(googleMarker) {

                    var marker = googleMarker.getMarker();
                    var details = googleMarker.getDetails();
                    var position = marker.getPosition();

                    if (polygon.containsLatLng(position)) {

                        console.debug(details.value + 'I\'m inside the polygon', googleMarker);
                    }
                });
            };

            // Selection: Gets fired when user has drawn polygon
            DrawingManager.prototype.onRectangleComplete = function(e) {

                console.debug('onRectangleComplete', e);
            };

            // Selection: Clear selected shape
            DrawingManager.prototype.clearSelection = function() {

                if (this.selectedShape) {
                    this.selectedShape.setEditable(false);
                    this.selectedShape = null;
                }
            };

            // Selection: Set selected shape
            DrawingManager.prototype.setSelection = function(shape) {
                
                this.clearSelection();
                this.selectedShape = shape;
                shape.setEditable(true);
                this.selectColor(shape.get('fillColor') || shape.get('strokeColor'));
            };

            // Selection: Delete selected shape from map
            DrawingManager.prototype.deleteSelectedShape = function() {

                if (this.selectedShape) {
                    this.selectedShape.setMap(null);
                }
            };

            // Selection: Give the selected shape a fancy color
            DrawingManager.prototype.setSelectedShapeColor = function(color) {
                
                if (this.selectedShape) {
                    
                    if (this.selectedShape.type == google.maps.drawing.OverlayType.POLYLINE) {
                        this.selectedShape.set('strokeColor', color);
                    } else {
                        this.selectedShape.set('fillColor', color);
                    }
                }
            };

            return DrawingManager;
        }
    }
})();
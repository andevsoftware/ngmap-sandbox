(function() {
    'use strict';

    angular
        .module('app')
        .config(configure);

        function configure($googleMapProvider, GoogleMapMarkerProvider, DrawingManagerProvider) {


            //////////////////////////////////////
            // GoogleMapMarkerProvider
            //////////////////////////////////////
        	var selected = {
        		fillColor: '#7c3136',
        		strokeColor: '#7c3136',
        		fillOpacity: 0.6,
        	};

        	function getSelected(fillColor, strokeColor, fillOpacity) {

        		return [
        		    '<?xml version="1.0" encoding="utf-8"?>',
        		    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
        		    '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 38 20" enable-background="new 0 0 38 20" xml:space="preserve">',
        		    '<ellipse fill="' + fillColor + '" stroke="' + strokeColor + '" fill-opacity="' + fillOpacity + '" stroke-width="2" stroke-miterlimit="10" cx="19" cy="10" rx="18" ry="9"/>',
        		    '</svg>'
        		].join('');
        	}

        	function getPinpoint(fillColor, strokeColor) {

                return [
                    '<?xml version="1.0" encoding="utf-8"?>',
                    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
                    '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 18 24" enable-background="new 0 0 18 24" xml:space="preserve">',
                    '<path fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-miterlimit="10" d="M17,8.8c0,1.6,0,5-6.8,13.3c-0.9,1.1-1.4,1.3-2.5,0 C1,14.1,1,10.7,1,8.8C1,4.5,4.6,1,9,1S17,4.5,17,8.8z"/>',
                    '</svg>'
                ].join('');
        	}

        	function getLabel(fillColor, strokeColor) {

                return [
                    '<?xml version="1.0" encoding="utf-8"?>',
                    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
                    '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 56 43" enable-background="new 0 0 56 43" xml:space="preserve">',
                    '<path fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="2" stroke-miterlimit="10" d="M51.5,33.6H36.4c-0.4,0-0.8,0.2-1.1,0.5l-5.6,6.4 c-0.6,0.7-1.6,0.7-2.2,0l-5.1-6.3c-0.3-0.3-0.7-0.5-1.1-0.5H4.5C2.6,33.6,1,32,1,30.1V4.5C1,2.6,2.6,1,4.5,1h47.1 C53.4,1,55,2.6,55,4.5v25.6C55,32,53.4,33.6,51.5,33.6z"/>',
                    '</svg>'
                ].join('');
        	}

        	GoogleMapMarkerProvider.setMarkerType('label', function(google) {

        		var html = [
	        		'<div class="inner">',
		        		'<div class="drop">',
		        			getSelected(selected.fillColor, selected.strokeColor, selected.fillOpacity),
		        		'</div>',
		        		'<div class="shape">',
		        			getLabel(this.color.fillColor, this.color.strokeColor),
		        		'</div>',
		        		'<div class="text">' + this.getValue() + '</div>',
	        		'</div>'
        		].join('');

                return {
                    position: new google.maps.LatLng(this.latitude, this.longitude),
                    labelAnchor: new google.maps.Point(28, 40),
                    labelClass: this.labelClass,
                    labelInBackground: true,
                    labelClass: this.selected ? 'map-label selected' : 'map-label',
                    labelContent: html,
                    icon: {

                        // Transparent background image
                        url: 'img/empty.png',
                        // This marker is 56 pixels wide by 48 pixels tall.
                        size: new google.maps.Size(56, 48),
                        // The origin for this image is 0,0.
                        origin: new google.maps.Point(0, 0),
                        // The anchor for this image is the base of the flagpole at 0,28.
                        anchor: new google.maps.Point(28, 40),
                    }
                };
        	});

        	GoogleMapMarkerProvider.setMarkerType('pinpoint', function(google) {

                var html = [
                    '<div class="inner">',
                        '<div class="drop">',
                            getSelected(selected.fillColor, selected.strokeColor, selected.fillOpacity),
                        '</div>',
                        '<div class="shape">',
                            getPinpoint(this.color.fillColor, this.color.strokeColor),
                        '</div>',
                    '</div>'
                ].join('');

                return {
                    position: new google.maps.LatLng(this.latitude, this.longitude),
                    labelAnchor: new google.maps.Point(15, 26),
                    labelClass: this.labelClass,
                    labelInBackground: true,
                    labelClass: this.selected ? 'map-pinpoint selected' : 'map-pinpoint',
                    labelContent: html,
                    icon: {

                        // Transparent background image
                        url: 'img/empty.png',
                        // This marker is 30 pixels wide by 34 pixels tall.
                        size: new google.maps.Size(30, 34),
                        // The origin for this image is 0,0.
                        origin: new google.maps.Point(0, 0),
                        // The anchor for this image is the base of the flagpole at 0,15.
                        anchor: new google.maps.Point(15, 26),
                    }
                };
        	});

            //////////////////////////////////////
            // DrawingManagerProvider
            //////////////////////////////////////

            var polyOptions = {
                strokeWeight: 0,
                fillOpacity: 0.45,
                editable: true
            };

            DrawingManagerProvider.configure({
                drawingModes: [
                    google.maps.drawing.OverlayType.POLYGON,
                    google.maps.drawing.OverlayType.RECTANGLE,
                ],
                drawingMode: google.maps.drawing.OverlayType.POLYGON,
                drawingControl: false,
                markerOptions: {
                    draggable: true
                },
                polylineOptions: {
                    editable: true
                },
                rectangleOptions: polyOptions,
                polygonOptions: polyOptions
            });

            //////////////////////////////////////
            // $googleMapProvider
            //////////////////////////////////////

			$googleMapProvider.configure({
                // Lets disable ugly point of interest points
                styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }]}],
                mapTypeControl: false,
                streetViewControl: false,
				panControl: false,
				zoomControl: false,
				scaleControl: false,
				zoom: 14,
				center: {
					lat: 52.49664, 
					lng: 5.073026
				}
			});
        }
})();
window.onload = initMaps();

// Initializing variable of the markers on the map
var markers = [];
var map;
var circles = new google.maps.Circle();

function initMaps() {

	document.getElementById("pac-input").focus();

	map = new google.maps.Map(document.getElementById('map'), {
		center : {
			lat : -22.8962899,
			lng : -47.0688179
		},
		zoom : 13
	});

	var input = /** @type {!HTMLInputElement} */
	(document.getElementById('pac-input'));

	var autocomplete = new google.maps.places.Autocomplete(input);
	autocomplete.bindTo('bounds', map);

	var infowindow = new google.maps.InfoWindow();

	autocomplete.addListener('place_changed', function() {

		infowindow.close();
		var place = autocomplete.getPlace();
		if (!place.geometry) {
			// User entered the name of a Place that was not suggested
			// and pressed the Enter key, or the Place Details request failed.
			window.alert("No details available for input: '" + place.name
					+ "'. Please select an entry available in the search.");
			return;
		} else {
			// Removes the markers and circles on the map
			deleteMarkers();
			deleteCircles();
		}

		// get lat
		var get_lat = place.geometry.location.lat();

		// get lng
		var get_lng = place.geometry.location.lng();

		// get complete address
		var get_addr = place.formatted_address;

		// If the place has a geometry, then present it on a map.
		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
			map.setZoom(15); // Why 15? Because it looks good.
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17); // Why 17? Because it looks good.
		}

		// Add markers
		var coordinates = [];
		coordinates.push(new google.maps.LatLng(get_lat, get_lng));
		coordinates.push(new google.maps.LatLng(get_lat - 0.001,
				get_lng + 0.001));
		coordinates.push(new google.maps.LatLng(get_lat + 0.0002,
				get_lng - 0.003));
		coordinates.push(new google.maps.LatLng(get_lat + 0.003,
				get_lng - 0.001));

		// Call function to add markers
		addMarker(coordinates, place);

		// Circles
		var citymap = {
			my_location : {
				center : {
					lat : get_lat,
					lng : get_lng
				}
			}
		}
		// Call function to add circle
		addCircles(citymap);
	});
};

function addMarker(coordinates, place) {
	for ( var coordinate in coordinates) {
		var marker = new google.maps.Marker({
			position : coordinates[coordinate],
			map : map,
			anchorPoint : new google.maps.Point(0, -29)
		});
		// Checking if it's the first item to add a custom icon
		if (coordinate == 0) {
			marker.setIcon(/** @type {google.maps.Icon} */
			({
				url : place.icon,
				size : new google.maps.Size(71, 71),
				origin : new google.maps.Point(0, 0),
				anchor : new google.maps.Point(17, 34),
				scaledSize : new google.maps.Size(35, 35)
			}));
			marker.setPosition(place.geometry.location);
			marker.setVisible(true);
		}
		// Add marker to vector
		markers.push(marker);
	}
}

function clearMarkers() {
	setMapOnAll(null);
}

function setMapOnAll(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}

function deleteMarkers() {
	clearMarkers();
	markers = [];
}

function addCircles(citymap) {
	// Construct the circle for each value in citymap.
	for ( var city in citymap) {
		// Add the circle for this city to the map.
		circles = new google.maps.Circle({
			strokeColor : '#3c8dbc',
			strokeOpacity : 0.8,
			strokeWeight : 2,
			fillColor : '#3c8dbc',
			fillOpacity : 0.35,
			map : map,
			center : citymap[city].center,
			radius : 500
		});
	}
}

function deleteCircles() {
	google.maps.event.clearListeners(circles, 'click_handler_name');
	google.maps.event.clearListeners(circles, 'drag_handler_name');
	circles.setRadius(0);
	circles.setMap(null);
}
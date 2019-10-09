var map = L.map('map-background').setView([45.9134921761407, -94.5452781520983], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var drawnItems = new L.FeatureGroup().addTo(map);
var drawControl = new L.Control.Draw({
	draw: {
		polyline: false,
		polygon: true,
		rectangle: false,
		circle: false,
		circlemarker: false,
		marker: false,
	},
	edit: {
		featureGroup: drawnItems,
		edit: false
	}
}).addTo(map);

function toWKT(layer) {
	var lng, lat, coords = [];
	if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
		var latlngs = layer.getLatLngs()[0];
		for (var i = 0; i < latlngs.length; i++) {
			coords.push(latlngs[i].lng + " " + latlngs[i].lat);
			if (i === 0) {
				lng = latlngs[i].lng;
				lat = latlngs[i].lat;
			}
		};
		if (layer instanceof L.Polygon) {
			return "MULTIPOLYGON (((" + coords.join(",") + "," + lng + " " + lat + ")))";
		} else if (layer instanceof L.Polyline) {
			return "LINESTRING (" + coords.join(",") + ")";
		}
	} else if (layer instanceof L.Marker) {
		return "MULTIPOINT (" + layer.getLatLng().lng + " " + layer.getLatLng().lat + ")";
	}
}